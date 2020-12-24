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