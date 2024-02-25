import { Eureka_Heartbeat_Interval, Eureka_Registery_Interval } from 'src/utils/constant';
import { Eureka } from 'eureka-js-client';

const env = process.env.NODE_ENV;

const appName = `COMMON-SERVICE${env === 'prod' ? '-DEV' : ''}`;
const executeUrl = `${process.env.HOST}:${process.env.PORT1}`;

export const eurekaClient = new Eureka({
  instance: {
    app: appName,
    hostName: executeUrl,
    ipAddr: process.env.HOST,
    port: {
      $: process.env.PORT1,
      '@enabled': true,
    },
    vipAddress: appName,
    statusPageUrl: `http://${executeUrl}`,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn', // 특정 조직이 자체적으로 운영하는 데이터 센터
    },
  },
  eureka: {
    host: process.env.Eureka_HOST,
    port: process.env.Eureka_PORT,
    servicePath: '/eureka/apps/',
    heartbeatInterval: Eureka_Heartbeat_Interval,
    registryFetchInterval: Eureka_Registery_Interval,
  },
});
