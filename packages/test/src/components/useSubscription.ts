import {
  DataStoreSnapshot,
  PersistentModel,
  PersistentModelConstructor,
} from "@aws-amplify/datastore";
import { PredicateAll } from "@aws-amplify/datastore/lib-esm/predicates";
import { API, graphqlOperation } from "aws-amplify";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSync } from "./AppsyncProvider";
import inflect from "i";
export { PredicateAll };

const i = inflect();
interface GetQueryResultItem {
  name: string;
  query: string;
}

interface GetQueriesResult {
  getOne: GetQueryResultItem;
  list: GetQueryResultItem;
  onUpdate: GetQueryResultItem;
  onDelete: GetQueryResultItem;
  onCreate: GetQueryResultItem;
}

const getQueries = (
  name: string,
  { sub, queries }: { sub: string; queries: string }
): GetQueriesResult => {
  const getQueryName = `get${name}`;
  const listQueryName = `list${name}s`;
  const onCreateQueryName = `onCreate${name}`;
  const onUpdateQueryName = `onUpdate${name}`;
  const onDeleteQueryName = `onDelete${name}`;

  return {
    getOne: {
      name: getQueryName,
      // @ts-ignore
      query: queries?.[getQueryName],
    },
    list: {
      name: listQueryName,
      // @ts-ignore
      query: queries?.[listQueryName],
    },
    onUpdate: {
      name: onUpdateQueryName,
      // @ts-ignore
      query: sub?.[onUpdateQueryName],
    },
    onCreate: {
      name: onCreateQueryName,
      // @ts-ignore
      query: sub?.[onCreateQueryName],
    },
    onDelete: {
      name: onDeleteQueryName,
      // @ts-ignore
      query: sub?.[onDeleteQueryName],
    },
  };
};

interface SubscriptionQuery extends GetQueryResultItem {
  variables?: any;
}
interface GenerateSubscriptionParams {
  queries: {
    createQuery: SubscriptionQuery;
    updateQuery: SubscriptionQuery;
    deleteQuery: SubscriptionQuery;
  };
  onDataUpdate: {
    onCreate: (newData: any) => void;
    onDelete: (newData: any) => void;
    onUpdate: (newData: any) => void;
  };
}
const generateSubscription = ({
  queries: { createQuery, updateQuery, deleteQuery },
  onDataUpdate: { onCreate, onDelete, onUpdate },
}: GenerateSubscriptionParams) => {
  const createSubscription = API.graphql(
    graphqlOperation(createQuery.query, createQuery?.variables || {})
    // @ts-ignore
  ).subscribe({
    next: (result: any) => {
      const newData = result?.value?.data?.[createQuery.name];
      console.log("new data created", createQuery.variables, newData);
      onCreate(newData);
    },
    error: (error: any) => console.warn(createQuery.name, error),
  });

  const updateSubscription = API.graphql(
    graphqlOperation(updateQuery.query, updateQuery?.variables || {})
    // @ts-ignore
  ).subscribe({
    next: (result: any) => {
      const newData = result?.value?.data?.[updateQuery.name];
      console.log("new data updated", updateQuery.variables, newData);
      onUpdate(newData);
    },
    error: (error: any) => console.warn(updateQuery.name, error),
  });

  const deleteSubScription = API.graphql(
    graphqlOperation(deleteQuery.query, deleteQuery?.variables || {})
    // @ts-ignore
  ).subscribe({
    next: (result: any) => {
      const newData = result?.value?.data?.[deleteQuery.name];
      console.log("new data deleted", newData);
      onDelete(newData);
    },
    error: (error: any) => console.warn(deleteQuery.name, error),
  });

  return {
    createSubscription,
    updateSubscription,
    deleteSubScription,
  };
};
export function useSubscription<T extends PersistentModel>({
  model,
}: {
  model: PersistentModelConstructor<T>;
}) {
  const [data, setData] = useState<DataStoreSnapshot<T>["items"]>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(true);
  const {
    graphqlQueries: { sub, queries },
    schema,
  } = useAppSync();

  const modelFields = useMemo(() => {
    const fields = schema?.models?.[model?.name]?.fields;
    let results: any[] = [];
    Object.keys(fields)?.forEach((key) => {
      const currentItem = fields[key];
      if (currentItem?.type?.model) {
        results.push(currentItem);
      }
    });

    return results;
  }, [model.name, schema]);

  const dataIds = useMemo(() => data?.map(({ id }) => id), [data]);
  useEffect(() => {
    // needs fixing as it generates a new subscription everytime subsctription hits
    // also need to do it in a recursive way
    dataIds?.forEach((id) => {
      modelFields?.forEach((item) => {
        const modelTypeName = item?.type?.model;
        const baseQueryName = `${modelTypeName}By${model.name}Id`;

        const createQueryName = `onCreate${baseQueryName}`;
        const updateQueryName = `onUpdate${baseQueryName}`;
        const deleteQueryName = `onDelete${baseQueryName}`;

        const underscore = `${model.name}_${item.name}_Id`;
        const camelCasedId = i.camelize(underscore, false);

        const subscriptions = generateSubscription({
          queries: {
            createQuery: {
              name: createQueryName,
              query: sub?.[createQueryName],
              variables: {
                [camelCasedId]: id,
              },
            },
            updateQuery: {
              name: updateQueryName,
              query: sub?.[updateQueryName],
              variables: {
                [camelCasedId]: id,
              },
            },
            deleteQuery: {
              name: deleteQueryName,
              query: sub?.[deleteQueryName],
              variables: {
                [camelCasedId]: id,
              },
            },
          },
          onDataUpdate: {
            onCreate: getData,
            onUpdate: getData,
            onDelete: getData,
          },
        });
      });
    });
  }, [modelFields, dataIds]);

  const { getOne, onCreate, onUpdate, list, onDelete } = getQueries(
    model.name,
    {
      sub,
      queries,
    }
  );

  const getData = useCallback(async () => {
    const results = await API.graphql<typeof model[]>({
      query: list.query,
    });

    // @ts-ignore
    setData(results?.data?.[list.name]?.items);
  }, []);
  useEffect(() => {
    getData();
    const subscriptions = generateSubscription({
      queries: {
        createQuery: { ...onCreate, variables: {} },
        updateQuery: { ...onUpdate, variables: {} },
        deleteQuery: { ...onDelete, variables: {} },
      },
      onDataUpdate: {
        onCreate: (newData) => setData((currData) => [...currData, newData]),
        onUpdate: (newData) =>
          setData((currData) =>
            currData?.map((item) => {
              if (item?.id === newData?.id) {
                return newData;
              }
              return item;
            })
          ),
        onDelete: (newData) =>
          setData((currData) =>
            currData?.filter((item) => item.id !== newData?.id)
          ),
      },
    });
    return () => {
      subscriptions.createSubscription.unsubscribe();
      subscriptions.updateSubscription.unsubscribe();
      subscriptions.deleteSubScription.unsubscribe();
    };
  }, []);
  return {
    first: data?.[0],
    data,
    loading,
    error,
  };
}
