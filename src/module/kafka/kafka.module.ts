import { Module } from '@nestjs/common';
import { ConsumerService } from './kafka-consumer.service';
import { ProducerService } from './kafka-producer.service';

@Module({
  providers: [ConsumerService, ProducerService],
  exports: [ConsumerService, ProducerService],
})
export class KafkaModule {}
