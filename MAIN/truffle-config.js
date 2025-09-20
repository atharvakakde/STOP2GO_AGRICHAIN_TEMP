module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network ID
    }
  },
  compilers: {
    solc: {
      version: "0.8.0" // Specify the exact version or "0.8.20" (latest 0.8.x as of 2025)
    }
  }
};