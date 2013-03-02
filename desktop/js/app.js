(function( exports ){
    'use strict';

    var App = Ember.Application.create(),
        productImgPath = '/img/products/%@/medium/%@.jpg';
    exports.App = App;


    // Data

    var Event = Ember.Object.extend({
        // productsBinding : Ember.Binding.oneWay('App.Data.Products')
    });

    var Color = Ember.Object.extend({
        frontImgSrc : function() {
            return productImgPath.fmt( this.get( 'product' ).style, this.get( 'front' ));
        }.property( 'product', 'front' ),
        backImgSrc : function() {
            return productImgPath.fmt( this.get( 'product' ).style, this.get( 'back' ));
        }.property( 'product', 'back' )
    });

    App.Data = {

        Events : [
            Event.create({
                id : 137,
                products : [256]
            }), Event.create({
                id : 138,
                products : []
            }), Event.create({
                id : 139,
                products : []
            })
        ],

        Products : [
            Ember.Object.create({
                id : 256,
                title : 'Sea Breeze Villa/Faith Dress',
                style : 'T1606',
                options : [{
                    color : 404,
                    size : -2,
                    quantity : {reserved : 0, available : 1},
                    price : {list : 194, sale : 79}
                }, {
                    color : 405,
                    size : -1,
                    quantity : {reserved : 0, available : 1},
                    price : {list : 194, sale : 79}
                }, {
                    color : 406,
                    size : 0,
                    quantity : {reserved : 0, available : 0},
                    price : {list : 194, sale : 79}
                }, {
                    color : 407,
                    size : 0,
                    quantity : {reserved : 0, available : 0},
                    price : {list : 194, sale : 79}
                }]
            }),
            Ember.Object.create({
                id : 257,
                title : 'Sea Breeze Villa/Faith Dress',
                style : 'T1606',
                options : [{
                    color : 404,
                    size : -2,
                    quantity : {reserved : 0, available : 1},
                    price : {list : 194, sale : 79}
                }, {
                    color : 405,
                    size : -1,
                    quantity : {reserved : 0, available : 1},
                    price : {list : 194, sale : 79}
                }, {
                    color : 406,
                    size : 0,
                    quantity : {reserved : 0, available : 0},
                    price : {list : 194, sale : 79}
                }]
            })
        ],

        Colors : [
            Color.create({
                id : 404,
                name : 'BLACK 001MS',
                front : 1592256,
                back : 1592255
            }), Color.create({
                id : 405,
                name : 'PALM 6248A',
                front : 1592258,
                back : 1592257
            }), Color.create({
                id : 406,
                name : 'RED 944MS',
                front : 1592254,
                back : 1592253
            }), Color.create({
                id : 407,
                name : 'STRIPE 6231A',
                front : 1592468,
                back : 0
            })
        ],

        Sizes : [
            Ember.Object.create({
                id : -2,
                name : 'XS'
            }), Ember.Object.create({
                id : -1,
                name : 'S'
            }), Ember.Object.create({
                id : 0,
                name : 'M'
            }), Ember.Object.create({
                id : 1,
                name : 'L'
            }), Ember.Object.create({
                id : 2,
                name : 'XL'
            })
        ]

    };


    // Routers
    App.Router.map(function() {
        this.resource('events', function() {
            this.resource('event', {path : ':event_id'}, function() {
                this.resource('quick-look', {path : 'quick-look/:product_id'});
            });
        });
        this.resource('products', function() {
            this.resource('product', {path : ':product_id'});
        });
    });

    App.IndexRoute = Ember.Route.extend({
        redirect : function() {
            this.transitionTo('events');
        }
    });

    App.EventsRoute = Ember.Route.extend({
        model : function() {
            return App.Data.Events;
        }
    });

    App.EventRoute = Ember.Route.extend({
        model : function( path ) {
            var ev = App.Data.Events.findProperty( 'id', parseInt( path.event_id, 10 ) );

            ev.products.forEach( function( productId, i ) {
                var product = App.Data.Products.findProperty( 'id', productId );
                this.products[i] = product;

                product.options.forEach( function( option, j ) {
                    option.color = App.Data.Colors.findProperty( 'id', option.color );
                    option.color.product = this;
                }, product );

            }, ev);

            return ev.products;
        }
    });

    App.ProductsRoute = Ember.Route.extend({
        model : function() {
            return App.Data.Products;
        }
    });


    // Controllers
    App.EventsController = Ember.ArrayController.extend();
    App.EventController = Ember.ArrayController.extend();
    App.ProductsController = Ember.ArrayController.extend();


}( window ));
