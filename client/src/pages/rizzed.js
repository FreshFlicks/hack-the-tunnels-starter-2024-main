const query = `
  query getUser($id: Int!) {
    getUser(id: $id) {
      id
      name
      email
    }
  }
`;

// Variables
const variables = {
  id: 1
};

// Send the query using fetch
fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: query,
    variables: variables
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
