const env = config.env;

module.exports = {
    commonRoute : '/api',
    routers : [        
        {
            toRoute: '/sample',
            folder: '/sample',
            router: '/router.js',
            activate: true
        },                

        // ..

    ]
}