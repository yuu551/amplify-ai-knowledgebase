export function request(ctx) {
  const { input } = ctx.args;
  return {
    resourcePath: "/knowledgebases/EQ7FTLNFVM/retrieve",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        retrievalQuery: {
          text: input
        }
      }),
    },
  };
}

export function response(ctx) {
  return JSON.stringify(ctx.result.body);
}