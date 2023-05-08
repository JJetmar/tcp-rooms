module.exports = {
    apps : [
        {
            name: "tcp-rooms",
            script: "./src/index.js",
            instances: 1,
            env: {
                "TCP_PORT": 80
            }
        }
    ]
}
