module.exports = {
  someSidebar: [
    {
      type: "doc",
      id: "overview",
    },
    {
      type: "category",
      label: "Request Types",
      items: [
        {
          type: "category",
          label: "REST request",
          items: [
            "requests/rest-request/get",
            "requests/rest-request/post",
            "requests/rest-request/put",
            "requests/rest-request/patch",
            "requests/rest-request/delete",
          ],
        },
        {
          type: "category",
          label: "Pure REST request",
          items: [
            "requests/pure-rest-request/get",
            "requests/pure-rest-request/post",
            "requests/pure-rest-request/put",
            "requests/pure-rest-request/patch",
            "requests/pure-rest-request/delete",
          ],
        },
        {
          type: "category",
          label: "JSON-RPC request",
          items: [
            "requests/json-rpc-request/batched",
            "requests/json-rpc-request/regular",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Examples",
      items: [
        "examples/universal-requests",
        "examples/validations",
        "examples/one-interface",
        "examples/error-catching",
        "examples/cancel-requests",
        "examples/logging",
        "examples/query-params",
        "examples/response-progress",
        "examples/retry-requests",
        "examples/translation",
        "examples/browser-support",
        "examples/request-timeout",
        "examples/proxy-maker",
        "examples/caching",
        "examples/files-downloading",
      ],
    },
  ],
};
