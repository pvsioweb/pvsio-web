export const buttonWidgetTemplate: string = `
{{#if template_description}}<!-- Basic template for button widgets.
     The widget has two layers:
      - a base layer renders the visual appearance
      - an overlay layer captures user interactions with the widget -->{{/if}}
<div id="{{id}}"
     style="position:{{position}}; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:{{zIndex}}; overflow:hidden;"
     class="{{type}} noselect{{#if blinking}} blink{{/if}}">
    <div id="{{id}}_base"
         style="position:absolute; width:{{width}}px; height:{{height}}px; line-height:{{height}}px; {{#each style}} {{@key}}:{{this}};{{/each}}"
         class="{{type}}_base {{id}}_base"></div>
    <div id="{{id}}_overlay"
         style="position:absolute; width:{{width}}px; height:{{height}}px; background-color:{{style.overlay-color}}; border-radius:{{style.border-radius}}; cursor:{{style.cursor}}; opacity:0;"
         class="{{type}}_overlay {{id}}_overlay"></div>
</div>`;

export const digitsTemplate: string = `
{{#if template_description}}<!-- Template defining the visual appearance of integer and fractional part of a numeric display widget -->{{/if}}
<div class="{{type}}_whole_part" style="position:absolute; left:0px; padding-left:{{whole.padding-left}}px; width:{{whole.width}}px; height:{{whole.height}}px; {{#if whole.margin-top}}margin-top:{{whole.margin-top}};{{/if}} text-align:right; display:inline-flex;">{{#each whole.digits}}
    <div style="border-radius:2px;text-align:center; width:{{../whole.letter-spacing}}px; min-width:{{../whole.letter-spacing}}px; max-width:{{../whole.letter-spacing}}px; font-size:{{font-size}}pt;{{#if selected}} color:{{../whole.background-color}}; background-color:{{../whole.color}}; transform:scale(0.9); transform-origin:bottom;{{else}} color:{{../whole.color}}; background-color:{{../whole.background-color}};{{/if}}">{{val}}</div>{{/each}}
</div>

{{#if point.viz}}<div class="{{type}}_decimal_point" style="position:absolute; text-align:center; margin-left:{{point.margin-left}}px; left:{{point.left}}px; width:{{point.width}}px; min-width:{{point.width}}px; max-width:{{point.width}}px; height:{{point.height}}px; text-align:center; font-size:{{point.font-size}}pt;">
&bull;</div>{{/if}}

{{#if frac.viz}}<div class="{{type}}_frac_part" style="position:absolute; left:{{frac.left}}px; width:{{frac.width}}px; height:{{frac.height}}px; {{#if frac.margin-top}}margin-top:{{frac.margin-top}};{{/if}} text-align:left; display:inline-flex;">{{#each frac.digits}}
    <div style="border-radius:2px; text-align:center; width:{{../frac.letter-spacing}}px; min-width:{{../frac.letter-spacing}}px; max-width:{{../frac.letter-spacing}}px; font-size:{{font-size}}pt;{{#if selected}} color:{{../frac.background-color}}; background-color:{{../frac.color}}{{else}} color:{{../frac.color}}; background-color:{{../frac.background-color}}{{/if}}">{{val}}</div>{{/each}}
</div>{{/if}}`;

export const genericWidgetTemplate: string = `
{{#if template_description}}<!--
    Basic widget template. Provides a base layer for rendering the visual appearance of the widget
    The widget has three layers:
      - a div layer defining position and size of the widget
      - a base layer renders the visual appearance
      - an overlay layer captures user interactions with the widget -->{{/if}}
<div style="width:0px; height:0px">
<div id="{{id}}"
     style="position:{{position}}; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:{{zIndex}}; overflow:{{overflow}};"
     class="{{type}} noselect{{#if blinking}} blink{{/if}}">
    <div id="{{id}}_base"
         style="position:absolute; width:{{width}}px; height:{{height}}px; line-height:{{height}}px; z-index:inherit; {{#each style}} {{@key}}:{{this}};{{/each}}"
         class="{{type}}_base {{id}}_base"></div>
    <div id="{{id}}_overlay"
         style="position:absolute; width:{{width}}px; height:{{height}}px; background-color:{{style.overlay-color}}; border-radius:{{style.border-radius}}; cursor:{{style.cursor}}; opacity:0; z-index:inherit;"
         class="{{type}}_overlay {{id}}_overlay"></div>
</div>
</div>`;

export const triangleTemplate: string = `
<!-- template for drawing a triangle with a color gradient -->
<div id="{{id}}" style="z-index:{{zIndex}}; position:absolute; overflow:hidden; width:100px; height:32px; transform-origin:left; transform:{{transform}};">
    {{#if triangle}}
    <div style="display:block;
                position:absolute;
                top:16px; left:0px;
                background-image: {{gradient}};
                transform:skewY(-20deg);
                height:40px;
                width:80px;">
    </div>
    {{/if}}
</div>`;