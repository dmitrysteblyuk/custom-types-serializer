import {errorType} from './types';

export const errorDeserializer = errorType.createDeserializer(Error);
