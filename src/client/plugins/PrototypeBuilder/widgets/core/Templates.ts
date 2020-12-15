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