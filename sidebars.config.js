module.exports = {
  someSidebar: {
    'Overview': ['overview'],
    'Request Types': [
      {
        type: 'category',
        label: 'REST request',
        items: [
          'requests/rest-request/blob',
          'requests/rest-request/text',
          'requests/rest-request/get',
          'requests/rest-request/post',
          'requests/rest-request/put',
          'requests/rest-request/patch',
          'requests/rest-request/delete'
        ],
      },
      {
      type: 'category',
        label: 'Pure REST request',
        items: [
          'requests/pure-rest-request/blob',
          'requests/pure-rest-request/text',
          'requests/pure-rest-request/get',
          'requests/pure-rest-request/post',
          'requests/pure-rest-request/put',
          'requests/pure-rest-request/patch',
          'requests/pure-rest-request/delete'
        ],
      },
      {
        type: 'category',
        label: 'JSON-RPC request',
        items: ['requests/json-rpc-request/batched','requests/json-rpc-request/regular'],
      }
    ],
    Features: ['features/mdx'],
  },
};

