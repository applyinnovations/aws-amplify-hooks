export interface GraphqlPayLoad {
  operationName: string;
  query: string;
  variables: any;
  formattedQuery: string;
}
export const getIntrospectionQuery = ({
  authToken,
  url,
}: {
  authToken: string;
  url: string;
  operationName?: string;
}) => {
  return fetch(url, {
    method: "POST",
    headers: {
      authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "IntrospectionQuery",
      query: `
        query IntrospectionQuery {
          __schema {
            
            mutationType {
              name
            }
            
            types {
              ...FullType
            }
            
          }
        }
        
        fragment FullType on __Type {
          kind
          name
          description
          fields(includeDeprecated: true) {
            name
            description
            args {
              ...InputValue
            }
            type {
              ...TypeRef
            }
            isDeprecated
            deprecationReason
          }
          inputFields {
            ...InputValue
          }
          interfaces {
            ...TypeRef
          }
          enumValues(includeDeprecated: true) {
            name
            description
            isDeprecated
            deprecationReason
          }
          possibleTypes {
            ...TypeRef
          }
        }
        
        fragment InputValue on __InputValue {
          name
          description
          type {
            ...TypeRef
          }
          defaultValue
        }
        
        fragment TypeRef on __Type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
        
        `,
    }),
  }).then((res) => res.json());
};
