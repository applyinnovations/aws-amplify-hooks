import { PersistentModel } from '@aws-amplify/datastore';
import { DataStore } from 'aws-amplify';
export declare function useSubscription<T extends PersistentModel>(...params: Parameters<typeof DataStore.observeQuery>, : any, T: any): any;
