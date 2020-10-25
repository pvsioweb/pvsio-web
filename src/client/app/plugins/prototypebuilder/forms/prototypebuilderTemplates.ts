export const openProject: string = `
<div class="form-center">
    <div class="card panel panel-info shadow center scrollable-dialog">
        <div class="card-header panel-heading">Open Project</div>
        <form class="center form-horizontal" onsubmit="return false" style="padding:10px;">
            <div class="panel-body">
                <div class="form-group">
					<div class="row">
						{{#each projects}}
						<div class="col-xs-6 col-md-4" style="margin-bottom:32px;">
							<div class="thumbnail">
								<div class="image">
                                    {{#if this.image}}
                                    <img src="{{../origin}}projects/{{this.name}}/{{this.image}}"
                                         onclick="document.getElementById('{{this.name}}').click();"
                                         style="cursor:pointer;">
                                    {{else}}
                                    <img src="{{../origin}}projects/cry.png"
                                         onclick="document.getElementById('{{this.name}}').click();"
                                         style="cursor:pointer; max-height:120px; padding-top:32px;"
                                         alt="No Image Available">
                                    No Image Available
                                    {{/if}}
								</div>
								<div class="caption">
									<h6>{{this.name}}</h6>
									<button type="button" class="btn btn-primary" data-project="{{this.name}}" id="{{this.name}}">Open</button>
								</div>
							</div>
						</div>
						{{/each}}
					</div>
				</div>
            </div>
            <div class="card-footer panel-footer">
                <button type="button" class="btn btn-danger left" id="btnCancel">Cancel</button>
            </div>
        </form>
    </div>
</div>`;


// `
// <div class="form-center">
//     <div class="card panel panel-info shadow center makscrollable-dialog">
//         <div class="card-header modal-header panel-heading">Open Project</div>
//         <form class="center form-horizontal" onsubmit="return false">
//             <div class="panel-body">
//                 <div class="form-group">
// 					<div class="row">
// 						{{#each projects}}
//                             <div class="col-xs-6 col-md-4" style="margin-bottom:32px;">
//                                 <div class="thumbnail">
//                                     <div class="image">
//                                         {{#if this.image}}
//                                         <img src="{{../origin}}projects/{{this.name}}/{{this.image}}"
//                                             onclick="document.getElementById('{{this.name}}').click();"
//                                             style="cursor:pointer;">
//                                         {{else}}
//                                         <img src="{{../origin}}projects/cry.png"
//                                             onclick="document.getElementById('{{this.name}}').click();"
//                                             style="cursor:pointer; max-height:120px; padding-top:32px;"
//                                             alt="No Image Available">
//                                         No Image Available
//                                         {{/if}}
//                                     </div>
//                                     <div class="caption">
//                                         <h6>{{this.name}}</h6>
//                                         <button type="button" class="btn btn-primary" data-project="{{this.name}}" id="{{this.name}}">Open</button>
//                                     </div>
//                                 </div>
//                             </div>
// 						{{/each}}
// 					</div>
// 				</div>
//             </div>
//             <div class="modal-footer panel-footer">
//                 <button type="button" class="btn btn-danger left" id="btnCancel">Cancel</button>
//             </div>
//         </form>
//     </div>
// </div>
// `;


// `
// <div class="form-center">
//     <div class="card panel panel-info shadow center  scrollable-dialog">
//         <div class="panel-heading">Open Project</div>
//         <form class="center form-horizontal" onsubmit="return false">
//             <div class="panel-body">
//                 <div class="form-group">
// 					<div class="row">
//                         {{#each projects}}
//                         <div class="card text-center" style="width:18rem;">
//                                 <img class="card-img-top" 
//                                         {{#if image}}
//                                         src="{{../origin}}projects/{{name}}/{{image}}"
//                                         {{else}}
//                                         src="{{../origin}}projects/cry.png"
//                                         {{/if}}
//                                     onclick="document.getElementById('{{name}}').click();"
//                                     style="cursor:pointer;">
//                                 <div class="card-body">
//                                 <h5 class="card-title">{{name}}</h5>
//                                 <button type="button" class="btn btn-primary" data-project="{{name}}" id="{{name}}">Open</button>
//                             </div>
//                         </div>
// 						{{/each}}
// 					</div>
// 				</div>
//             </div>
//             <div class="panel-footer">
//                 <button type="button" class="btn btn-danger left" id="btnCancel">Cancel</button>
//             </div>
//         </form>
//     </div>
// </div>
// `