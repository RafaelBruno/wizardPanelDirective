wizardPanelDirective
====================

Wizard Panel using angular directives, bootstrap and jquery

required: 

- Bootstrap
- jQuery
- AngularJs
- Angular-resource

Usage

1 - Include <a href="http://humlab.com.br/projects/wizardPanelDirective/wizard.js">wizard.js</a> in your html code

2 - Include <a href="http://humlab.com.br/projects/wizardPanelDirective/wizard.css">wizard.css</a> in your head tag

3 - Inject 'wizard-module' in your angular module
	
	$yourModule = angular.module("myApp", ['wizard-module']);

4 - Insert wizard tag in your code

	<wizard next-label="Next" back-label="Back" 
			alert-label="Fill out all required fields">
			<wizardstep paneltitle="First Step">
				<h2>First Step of Wizard Panel</h2>
			</wizardstep>

			<wizardstep paneltitle="Required Step"> 
				<form role="form">
					<required>
						<div class="form-group">
							<label for="exampleInputEmail1">Email address*</label>
							<input class="form-control"
							id="exampleInputEmail1" placeholder="Enter email">
						</div>
					</required>
					<required>
						<div class="form-group">
							<label for="exampleInputPassword1">Password*</label>
							<input class="form-control" 
							id="exampleInputPassword1" placeholder="Password">
						</div>
					</required>
				</form>
			</wizardstep>

			<wizardstep paneltitle="Required Panel Step">
				<required type="panel" panel-title="Required Field">
					<div class="form-group">
						<label for="address">Address*</label>
						<input class="form-control"
						id="address" placeholder="Insert your Address">
					</div>
				</required>
			</wizardstep>

			<wizardstep paneltitle="Final Step"> 
				Final Step
			</wizardstep>
	</wizard>



Obs:

	//<required></required>
* This tag indicates a required field

	//required type="panel" panel-title="Required Field"
* This tag indicates a required field in the panel format

	//next-label="Next" and back-label="Back"
* Label of the next button and back button

	//alert-label="Fill out all required fields"
* Label of the required alert message 

