import { PaymentTransactionRepository } from '../models/payment-transaction';
import { PaymentMethodRepository } from '../models/payment-method';
import { KAFKA_TOPICS, createEvent, PAYMENT_STATUS } from '@saga-pattern/shared';
import { KafkaProducer } from '@saga-pattern/shared';
import { Logger } from '@saga-pattern/shared';

export class PaymentService {
  constructor(
    private paymentTransactionRepository: PaymentTransactionRepository,
    private paymentMethodRepository: PaymentMethodRepository,
    private kafkaProducer: KafkaProducer,
    private logger: Logger
  ) {}

  async processPayment(orderId: string, customerId: string, amount: number, paymentMethodId: string): Promise<void> {
    this.logger.info('Processing payment for order', { orderId, customerId, amount, paymentMethodId });
    
    try {
      // Get payment method
      const paymentMethod = await this.paymentMethodRepository.getPaymentMethodById(paymentMethodId);
      
      if (!paymentMethod) {
        this.logger.warn('Payment method not found', { paymentMethodId });
        await this.publishPaymentFailed(orderId, customerId, amount, 'Payment method not found');
        return;
      }

      // Verify payment method belongs to customer
      if (paymentMethod.customerId !== customerId) {
        this.logger.warn('Payment method does not belong to customer', { 
          paymentMethodId, 
          customerId, 
          methodCustomerId: paymentMethod.customerId 
        });
        await this.publishPaymentFailed(orderId, customerId, amount, 'Payment method does not belong to customer');
        return;
      }

      // Check if payment method is expired
      const currentDate = new Date();
      const expiryDate = new Date(paymentMethod.expiryYear, paymentMethod.expiryMonth - 1);
      
      if (expiryDate < currentDate) {
        this.logger.warn('Payment method expired', { paymentMethodId, expiryDate });
        await this.publishPaymentFailed(orderId, customerId, amount, 'Payment method has expired');
        return;
      }

      // Create payment transaction
      const transaction = await this.paymentTransactionRepository.createTransaction({
        orderId,
        customerId,
        amount,
        paymentMethodId,
        status: PAYMENT_STATUS.PROCESSING,
      });

      // Simulate payment processing (in real implementation, this would call a payment gateway)
      const paymentResult = await this.simulatePaymentProcessing(transaction, paymentMethod);
      
      if (paymentResult.success) {
        // Update transaction as completed
        await this.paymentTransactionRepository.updateTransactionStatus(
          transaction.id,
          PAYMENT_STATUS.COMPLETED,
          paymentResult.transactionId
        );

        // Publish PaymentProcessed event
        const paymentProcessedEvent = createEvent('PaymentProcessed', {
          orderId,
          customerId,
          amount,
          paymentMethod: paymentMethod.type,
          transactionId: paymentResult.transactionId,
        });

        await this.kafkaProducer.publishEvent(KAFKA_TOPICS.PAYMENT_EVENTS, paymentProcessedEvent);
        
        this.logger.info('Payment processed successfully', { 
          orderId, 
          transactionId: paymentResult.transactionId 
        });
      } else {
        // Update transaction as failed
        await this.paymentTransactionRepository.updateTransactionStatus(
          transaction.id,
          PAYMENT_STATUS.FAILED
        );

        await this.publishPaymentFailed(orderId, customerId, amount, paymentResult.reason);
      }
    } catch (error) {
      this.logger.error('Failed to process payment', { 
        orderId, 
        customerId, 
        error: error.message 
      });
      
      await this.publishPaymentFailed(orderId, customerId, amount, 'Payment processing failed due to system error');
    }
  }

  async handleOrderCancelled(event: any): Promise<void> {
    this.logger.info('Handling order cancellation for payment service', { 
      orderId: event.data.orderId 
    });
    
    try {
      // Get all transactions for this order
      const transactions = await this.paymentTransactionRepository.getTransactionsByOrderId(event.data.orderId);
      
      // Process refunds for completed transactions
      for (const transaction of transactions) {
        if (transaction.status === PAYMENT_STATUS.COMPLETED) {
          await this.processRefund(transaction);
        }
      }
      
      this.logger.info('Order cancellation processed by payment service', { 
        orderId: event.data.orderId,
        transactionsProcessed: transactions.length 
      });
    } catch (error) {
      this.logger.error('Failed to process order cancellation', { 
        orderId: event.data.orderId,
        error: error.message 
      });
    }
  }

  private async simulatePaymentProcessing(transaction: any, paymentMethod: any): Promise<{ success: boolean; transactionId?: string; reason?: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simulate payment processing logic
    const random = Math.random();
    
    // 90% success rate for demonstration
    if (random < 0.9) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
    } else {
      const reasons = [
        'Insufficient funds',
        'Card declined',
        'Invalid payment method',
        'Payment gateway timeout',
        'Fraud detection triggered',
      ];
      
      return {
        success: false,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
      };
    }
  }

  private async processRefund(transaction: any): Promise<void> {
    this.logger.info('Processing refund for transaction', { transactionId: transaction.id });
    
    try {
      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Update transaction status to refunded
      await this.paymentTransactionRepository.updateTransactionStatus(
        transaction.id,
        PAYMENT_STATUS.REFUNDED,
        `refund_${transaction.transactionId}`
      );

      // Publish PaymentRefunded event
      const paymentRefundedEvent = createEvent('PaymentRefunded', {
        orderId: transaction.orderId,
        customerId: transaction.customerId,
        amount: transaction.amount,
        transactionId: transaction.transactionId,
      });

      await this.kafkaProducer.publishEvent(KAFKA_TOPICS.PAYMENT_EVENTS, paymentRefundedEvent);
      
      this.logger.info('Refund processed successfully', { 
        transactionId: transaction.id,
        amount: transaction.amount 
      });
    } catch (error) {
      this.logger.error('Failed to process refund', { 
        transactionId: transaction.id,
        error: error.message 
      });
    }
  }

  private async publishPaymentFailed(orderId: string, customerId: string, amount: number, reason: string): Promise<void> {
    // Publish PaymentFailed event
    const paymentFailedEvent = createEvent('PaymentFailed', {
      orderId,
      customerId,
      amount,
      reason,
    });

    await this.kafkaProducer.publishEvent(KAFKA_TOPICS.PAYMENT_EVENTS, paymentFailedEvent);
    
    this.logger.info('Payment failed event published', { orderId, reason });
  }

  async getTransactionById(transactionId: string) {
    return this.paymentTransactionRepository.getTransactionById(transactionId);
  }

  async getTransactionsByOrderId(orderId: string) {
    return this.paymentTransactionRepository.getTransactionsByOrderId(orderId);
  }

  async getTransactionsByCustomerId(customerId: string) {
    return this.paymentTransactionRepository.getTransactionsByCustomerId(customerId);
  }

  async createPaymentMethod(paymentMethod: Omit<any, 'id'>) {
    return this.paymentMethodRepository.createPaymentMethod(paymentMethod);
  }

  async getPaymentMethodsByCustomerId(customerId: string) {
    return this.paymentMethodRepository.getPaymentMethodsByCustomerId(customerId);
  }
}
