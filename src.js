'use strict';

const defaultHost = 'localhost';
const defaultPort = 9229;

document.addEventListener('DOMContentLoaded', function onLoad() {

  launch.addEventListener('click', function onClick() {
    const hostValue = host.value || defaultHost;
    const portValue = +port.value || defaultPort;
    const jsonUrl = `http://${hostValue}:${portValue}/json/list`;
    error.style.display = 'none';
    fetch(jsonUrl)
      .then(function parseJson (response) {
        if (response.status !== 200) {
          throw new Error(`Invalid configuration data at ${jsonUrl}`);
        }

        return response.json();
      })
      .then(function getId (data) {
        try {
          return data[0].devtoolsFrontendUrl.match(/\/(@\w+)\//)[1];
        } catch (err) {
          throw new Error(
            `Invalid devtools URL in ${JSON.stringify(data, null, 2)}`
          );
        }
      })
      .then(function openInspector (id) {
        const url = `chrome-devtools://devtools/remote/serve_file/` +
                    `${id}/inspector.html` +
                    `?experiments=true&v8only=true` +
                    `&ws=${hostValue}:${portValue}/node`;

        chrome.tabs.create({ url });
      })
      .catch(function errorHandler (err) {
        error.innerHTML = `Could not launch debugger<br>${err.message}`;
        error.style.display = 'block';
      });
  }, false);
}, false);
