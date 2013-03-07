(function( exports ){
    'use strict';

    var App = Ember.Application.create(),
        Color,
        Price,
        XS, S, M, L, XL,
        productImgPath = '/img/products/%@/%@/%@.jpg';
    exports.App = App;

    // Custom Objects
    Color = Ember.Object.extend({
        activeCameraAngle : 'angles.front',

        catalogImg : function() {
            return this.get( 'activeCameraAngle' ) === 'angles.front' ?
                this.get( 'frontCatalogImg' ) :
                this.get( 'backCatalogImg' );
        }.property( 'activeCameraAngle' ),

        frontCatalogImg : function() {
            return productImgPath.fmt(
                this.get( 'product' ).style, 'catalog', this.get( 'angles.front' ) );
        }.property( 'product', 'angles.front' ),

        backCatalogImg : function() {
            return productImgPath.fmt(
                this.get( 'product' ).style, 'catalog', this.get( 'angles.back' ) );
        }.property( 'product', 'angles.back' ),

        frontThumbImg : function() {
            return productImgPath.fmt(
                this.get( 'product' ).style, 'small', this.get( 'angles.front' ) );
        }.property( 'product', 'angles.front' ),

        backThumbImg : function() {
            return productImgPath.fmt(
                this.get( 'product' ).style, 'small', this.get( 'angles.back' ) );
        }.property( 'product', 'angles.back' ),

        materialIconImg : function() {
            return '/img/products/%@/%@.jpg'.fmt(
                this.get('product').style, this.get('name').replace(/ /g, '_').toLowerCase() );
        }.property( 'product', 'name' ),

        dashedName : function() {
            return this.get('name').dasherize();
        }.property( 'name' )
    });

    Price = Ember.Object.extend({

        discount : function() {
            return Math.round( 100 - this.get('sale')/this.get('retail')*100 );
        }.property( 'sale', 'retail' )
    });

    XS = Ember.Object.extend( {name : 'XS'} );
    S = Ember.Object.extend( {name : 'S'} );
    M = Ember.Object.extend( {name : 'M'} );
    L = Ember.Object.extend( {name : 'L'} );
    XL = Ember.Object.extend( {name : 'XL'} );


    App.Data = {

        Events : [
            Ember.Object.create({
                id : 137,
                title : 'TART',
                products : []
            }), Ember.Object.create({
                id : 138,
                title : 'foo',
                products : []
            }), Ember.Object.create({
                id : 139,
                title : 'bar',
                products : []
            })
        ],

        Products : [
            Ember.Object.create({
                id : 256,
                title : 'Sea Breeze Villa/Faith Dress',
                style : 'T1606',
                colors : []
            })
        ],

        Colors : [
            Color.create({
                id : 800,
                name : 'BLACK 001MS',
                angles : {front : 1592256, back : 1592255},
                price : Price.create( {sale : 79, retail : 194} ),
                sizes : [
                    XS.create( {inStock : 1, onHold : 0} ),
                    S.create( {inStock : 1, onHold : 1} ),
                    M.create( {inStock : 3, onHold : 0} ),
                    L.create( {inStock : 0, onHold : 0} ),
                    XL.create( {inStock: 0, onHold : 0} )
                ]
            }), Color.create({
                id : 801,
                name : 'PALM 6248A 6248A',
                angles : {front : 1592258, back : 1592257},
                price : Price.create( {sale : 79, retail : 194} ),
                sizes : [
                    XS.create( {inStock : 1, onHold : 0} ),
                    S.create( {inStock : 1, onHold : 1} ),
                    M.create( {inStock : 3, onHold : 0} ),
                    L.create( {inStock : 0, onHold : 0} ),
                    XL.create( {inStock: 0, onHold : 0} )
                ]
            }), Color.create({
                id : 802,
                name : 'RED 944MS 944MS',
                angles : {front : 1592254, back : 1592253},
                price : Price.create( {sale : 79, retail : 194} ),
                sizes : [
                    XS.create( {inStock : 1, onHold : 1} ),
                    S.create( {inStock : 12, onHold : 1} ),
                    M.create( {inStock : 3, onHold : 0} ),
                    L.create( {inStock : 0, onHold : 0} ),
                    XL.create( {inStock: 0, onHold : 0} )
                ]
            }), Color.create({
                id : 803,
                name : 'STRIPE 6231A 6231A',
                angles : {front : 1592468, back : 1592681},
                price : Price.create( {sale : 79, retail : 194} ),
                sizes : [
                    XS.create( {inStock : 1, onHold : 0} ),
                    S.create( {inStock : 1, onHold : 1} ),
                    M.create( {inStock : 3, onHold : 0} ),
                    L.create( {inStock : 0, onHold : 0} ),
                    XL.create( {inStock: 0, onHold : 0} )
                ]
            })
        ]

    };


    // Routers
    App.Router.map(function() {
        this.resource( 'events' );
        this.resource( 'event', {path : '/event/:event_id'}, function() {
            this.resource( 'quick-look', {path : 'quick-look/:product_id'}, function() {
                this.resource( 'color', {path : 'color/:color_name'} );
            });
        });
        this.resource( 'product', {path : '/product/:product_id'});
    });

    App.IndexRoute = Ember.Route.extend({
        redirect : function() {
            this.transitionTo( 'events' );
        }
    });

    App.EventsRoute = Ember.Route.extend({
        model : function() {
            return App.Data.Events;
        }
    });

    App.EventRoute = Ember.Route.extend({
        model : function( params ) {
            return App.Data.Events.findProperty( 'id', parseInt( params.event_id, 10 ) );
        }
    });

    App.QuickLookRoute = App.ProductRoute = Ember.Route.extend({
        model : function( params ) {
            return App.Data.Products.findProperty( 'id', parseInt( params.product_id, 10 ) );
        }
    });

    App.ColorRoute = Ember.Route.extend({
        model : function( params ) {
            return App.Data.Colors.findProperty( 'name', params.color_name.replace(/-/g, ' ').toUpperCase() );
        },
        serialize : function( model ) {
            return {
                color_name : model.get('name').dasherize()
            };
        }
    });


    // Controllers
    App.EventsController = Ember.ArrayController.extend();

    App.EventController = Ember.ObjectController.extend();

    App.QuickLookController = Ember.ObjectController.extend({

        closeModal : function() {
            this.transitionToRoute( 'event' );
        }
    });

    App.ColorController = Ember.ObjectController.extend({
        selectedSize : null,
        quantities : [],

        selectPrevColor : function() {
            this.relativeSelectColor( -1 );
        },

        selectNextColor : function() {
            this.relativeSelectColor( 1 );
        },

        relativeSelectColor : function( incrementBy ) {
            var colors = App.Data.Colors,
                index = colors.indexOf( this.get( 'content' ) ) + incrementBy,
                lastIndex = colors.length - 1;

            this.setCameraAngle( 'angles.front' );
            this.setSize( null );
            this.transitionToRoute( 'color',
                colors[ index < 0 ? lastIndex : index > lastIndex ? 0 : index ]);
        },

        setCameraAngle : function( angle ) {
            this.set( 'activeCameraAngle', angle );
        },

        setSize : function( size ) {
            this.set( 'selectedSize', size );
            this.setAvailableQuantity( size && size.inStock - size.onHold || 0 );
        },

        setAvailableQuantity : function( availableQuantity ) {
            var max = availableQuantity <= 6 ? availableQuantity : 6;

            for ( var i = 1, quantities = []; i <= max; i++ ) {
                quantities.push( i );
            }

            this.set( 'quantities', quantities );
        }
    });


    App.Views = {

        ZoomWrapper : Ember.View.extend({
            $foo : 12,
            eventManager : Ember.Object.create({
                mouseEnter : function( e, view ) {
                    var $view = view.$();
                    this.$children = $view.children();
                    this.offset = $view.offset();
                },
                mouseMove : function( e, view ) {
                    var $children = this.$children,
                        x = e.pageX - this.offset.left,
                        y = e.pageY - this.offset.top,
                        left = x - 35,
                        top = y - 62;

                    left = left < 1 ? 1 : left > 206 ? 206 : left;
                    top = top < 1 ? 1 : top > 291 ? 291 : top;

                    $children.filter( '.window' ).css( {left : left, top : top } );
                    $children.filter( '.top' ).css( 'height' , top );
                    $children.filter( '.left' ).css( {top : top, width : left} );
                    $children.filter( '.right' ).css( {top : top, width : 207 - left} );
                    $children.filter( '.bottom' ).css( 'height' , 292 - top );
                    $children.show();
                },
                mouseLeave : function( e, view ) {
                    view.$().children().hide();
                }
            })
        }),

        ThumbBorder : Ember.View.extend({
            classNameBindings : ['isActive:active'],

            isActive : function() {
                return this.get( 'controller.activeCameraAngle' ) === this.get( 'content' );
            }.property( 'controller.activeCameraAngle', 'content' ),

            eventManager : Ember.Object.create({
                mouseEnter : function( e, view ) {
                    view.get( 'controller' ).send( 'setCameraAngle', view.get( 'content' ));
                },
                click : function( e, view ) {
                    view.get( 'controller' ).send( 'setCameraAngle', view.get( 'content' ));
                }
            })

        }),

        ColorButton : Ember.View.extend({
            tagName : 'span',
            classNameBindings : [':color', 'isSelected:selected'],

            isSelected : function() {
                return this.get( 'controller.content' ) === this.get( 'content' );
            }.property( 'controller.content', 'content' ),

            click : function( e ) {
                this.get( 'controller' ).send( 'setSize', null );
            }
        }),

        SizeButton : Ember.View.extend({
            tagName : 'dd',

            isSelected : function() {
                return this.get( 'controller.selectedSize' ) === this.get( 'content' );
            }.property( 'controller.selectedSize', 'content' ),

            click : function( e ) {
                this.get( 'controller' ).send( 'setSize', this.get( 'content' ) );
            }

        })

    };


    // View Helpers
    Ember.Handlebars.registerBoundHelper('money', function( dollars ) {
        return dollars.toFixed(2);
    });


    App.prototype = {

        constructor : function() {
            this.bindModels();
        },

        bindModels : function() {
            var event = App.Data.Events[0];
            App.Data.Products.forEach( function( product ) {
                product.event = event;
                event.products.push( product );

                App.Data.Colors.forEach( function( color ) {
                    color.product = product;
                    product.colors.push( color );
                });
            });
        }

    };

    App.prototype.constructor();


}( window ));
