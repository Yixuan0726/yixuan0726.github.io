// Present split hosting assets as streaming responses to Unity's normal loader.
// Only the URLs in the build manifest are intercepted; other requests are unchanged.
export function installChunkedAssets(assets, baseUrl, host = globalThis) {
  if (!assets || !Object.keys(assets).length) return;
  const nativeFetch = host.fetch.bind(host);
  const routes = new Map(Object.entries(assets).map(([url, asset]) => [new URL(url, baseUrl).href, asset]));
  host.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, baseUrl).href;
    const asset = routes.get(url);
    if (!asset) return nativeFetch(input, init);
    const method = init.method ?? input.method ?? 'GET';
    const headers = {'Content-Type': asset.contentType, 'Content-Length': String(asset.bytes)};
    if (method === 'HEAD') return new Response(null, {headers});
    if (method !== 'GET') return nativeFetch(input, init);
    let reader, index = 0, received = 0;
    const abort = new AbortController();
    const signal = init.signal ?? input.signal;
    const stop = () => abort.abort(signal?.reason);
    if (signal?.aborted) stop();
    else signal?.addEventListener('abort', stop, {once: true});
    const cleanup = () => signal?.removeEventListener('abort', stop);
    const body = new ReadableStream({
      async pull(controller) {
        try {
          while (true) {
            if (!reader) {
              if (index === asset.parts.length) {
                if (received !== asset.bytes) throw Error('Incomplete game download. Please retry.');
                cleanup(); controller.close(); return;
              }
              const response = await nativeFetch(new URL(asset.parts[index++], baseUrl).href,
                {...init, signal: abort.signal});
              if (!response.ok || !response.body) throw Error('Game download failed. Please retry.');
              reader = response.body.getReader();
            }
            const {done, value} = await reader.read();
            if (done) { reader.releaseLock(); reader = null; continue; }
            received += value.byteLength;
            controller.enqueue(value); return;
          }
        } catch (error) { cleanup(); controller.error(error); }
      },
      cancel(reason) { cleanup(); abort.abort(reason); return reader?.cancel(reason); },
    });
    const response = new Response(body, {headers});
    Object.defineProperty(response, 'url', {value: url});
    return response;
  };
}
