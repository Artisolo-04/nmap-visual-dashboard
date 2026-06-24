const xml2js = require('xml2js');

async function parseNmapXML(xmlString) {
  
  const parser = new xml2js.Parser({ explicitArray: false });
  
  const result = await parser.parseStringPromise(xmlString);

  const hostNode = result?.nmaprun?.host;
  
  if (!hostNode) {
    return { host: null, state: 'down', ports: [] };
  }

  const host = Array.isArray(hostNode) ? hostNode[0] : hostNode;
  
  const addressNode = Array.isArray(host.address) ? host.address[0] : host.address;
  
  const hostIp = addressNode?.$?.addr || null;
  
  const state = host.status?.$?.state || 'unknown';

  let ports = [];
  
  if (host.ports?.port) {
    
    const portList = Array.isArray(host.ports.port) ? host.ports.port : [host.ports.port];
    
    ports = portList.map((p) => ({
      port     : p.$?.portid,
      protocol : p.$?.protocol,
      state    : p.state?.$?.state     || 'unknown',
      service  : p.service?.$?.name    || 'unknown',
      product  : p.service?.$?.product ||  null,
      version  : p.service?.$?.version ||  null,
    }));
  }

  return { host: hostIp, state, ports };
}

module.exports = { parseNmapXML };
