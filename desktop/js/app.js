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

        largeCatalogImg : function() {
            return productImgPath.fmt(
                this.get( 'product' ).style, 'large',
                    this.get( 'activeCameraAngle' ) === 'angles.front' ?
                        this.get( 'angles.front' ) :
                        this.get( 'angles.back' ) );
        }.property( 'product', 'angles.front', 'angles.back', 'activeCameraAngle' ),

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
        }.property( 'product', 'name' )
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
            })
        ],

        Products : [
            Ember.Object.create({
                title : 'Sea Breeze Villa/Faith Dress',
                style : 'T1606',
                colors : []
            })
        ],

        Colors : [
            Color.create({
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
            this.resource( 'quick-look', {path : 'quick-look/:product_style'}, function() {
                this.resource( 'color', {path : 'color/:color_name'} );
            });
        });
        this.resource( 'product', {path : '/product/:product_style'});
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
            return App.Data.Products.findProperty( 'style', params.product_style.toUpperCase() );
        },
        serialize : function( model ) {
            return {
                product_style : model.get( 'style' ).toLowerCase()
            };
        }
    });

    App.ColorRoute = Ember.Route.extend({
        model : function( params ) {
            return App.Data.Colors.findProperty( 'name', params.color_name.replace(/-/g, ' ').toUpperCase() );
        },
        serialize : function( model ) {
            return {
                color_name : model.get( 'name' ).dasherize()
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

        colors : function() {
            return this.get( 'product.colors' );
        }.property( 'product.colors' ),

        currentIndex : function() {
            return this.get( 'colors' ).indexOf( this.get( 'content' ) );
        }.property( 'colors', 'content' ),

        prevColor : function() {
            return this.get( 'colors' )[ this.get( 'currentIndex' ) - 1 ];
        }.property( 'currentIndex' ),

        nextColor : function() {
            return this.get( 'colors' )[ this.get( 'currentIndex' ) + 1 ];
        }.property( 'currentIndex' ),

        selectColor : function( color ) {
            this.transitionToRoute( 'color', color );
        },

        onColorChanged : function() {
            this.selectCameraAngle( 'angles.front' );
            this.selectSize( null );
        }.observes( 'content' ),

        selectCameraAngle : function( angle ) {
            this.set( 'activeCameraAngle', angle );
        },

        selectSize : function( size ) {
            this.set( 'selectedSize', size );
        },

        quantities : function() {
            var size = this.get( 'selectedSize' ),
                availableQuantity = size && size.inStock - size.onHold || 0,
                max = availableQuantity <= 6 ? availableQuantity : 6,
                quantities = [];

            for ( var i = 1; i <= max; i++ ) {
                quantities.push( i );
            }
            return quantities;
        }.property( 'selectedSize' )
    });


    App.Views = {

        ZoomWrapper : Ember.View.extend({
            eventManager : Ember.Object.create({
                initialized : false,

                mouseEnter : function( e, view ) {
                    var $view = view.$(),
                        $largeCatalogImg = $view.next();

                    this.$children = $view.children( ':not(img)' );
                    this.offset = $view.offset();

                    $largeCatalogImg.css( 'background-image', 'url(%@)'.fmt( $largeCatalogImg.attr( 'data-bg' ) ) );
                    this.$largeCatalogImg = $largeCatalogImg;
                    this.initialized = true;
                },
                mouseMove : function( e, view ) {
                    var $children = this.$children,
                        $largeCatalogImg = this.$largeCatalogImg,
                        offset = this.offset,
                        scale = 4.29,
                        x, y, left, top;

                    if ( !this.initialized ) {
                        return;
                    }

                    x = e.pageX - offset.left;
                    y = e.pageY - offset.top;

                    left = x - 35;
                    top = y - 62;
                    left = left < 1 ? 1 : left > 206 ? 206 : left;
                    top = top < 1 ? 1 : top > 291 ? 291 : top;

                    $children.filter( '.window' ).css( {left : left, top : top } );
                    $children.filter( '.top' ).css( 'height' , top );
                    $children.filter( '.left' ).css( {top : top, width : left} );
                    $children.filter( '.right' ).css( {top : top, width : 207 - left} );
                    $children.filter( '.bottom' ).css( 'height', 292 - top );
                    $largeCatalogImg.css( 'background-position', '-%@px -%@px'.fmt( left*scale, top*scale ) );

                    $children.show();
                    $largeCatalogImg.show();
                },
                mouseLeave : function( e, view ) {
                    this.$children.hide();
                    this.$largeCatalogImg.hide();
                    this.initialized = false;
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
                    view.get( 'controller' ).send( 'selectCameraAngle', view.get( 'content' ));
                }
            })

        }),

        ColorButton : Ember.View.extend({
            tagName : 'span',
            classNameBindings : [':color', 'isSelected:selected'],

            isSelected : function() {
                return this.get( 'controller.content' ) === this.get( 'content' );
            }.property( 'controller.content', 'content' )
        }),

        SizeButton : Ember.View.extend({
            tagName : 'dd',

            isSelected : function() {
                return this.get( 'controller.selectedSize' ) === this.get( 'content' );
            }.property( 'controller.selectedSize', 'content' ),

            click : function( e ) {
                this.get( 'controller' ).send( 'selectSize', this.get( 'content' ) );
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
