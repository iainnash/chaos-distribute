import Redis from 'ioredis';
import { redisUrl } from '../constants/env';
 
const redis = new Redis(redisUrl);
 
export default redis;