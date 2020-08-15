document.addEventListener('DOMContentLoaded', async() => {
    const editMainContainer = document.querySelector('.edit-main-container');
    const projectId = editMainContainer.getAttribute('id');

    //get project data - will work for new and edit projects
    const res1 = await fetch(`/api/projects/${projectId}`);
    const { project } = await res1.json();
    renderEditPage(project);
    //------------------------------------------
    function renderEditPage(project) {
        const numSteps = project.destructions.length;
        generateIntroPage(project);
        addEditButtonListener(0, projectId);
        if (numSteps > 0) {
            generateStepsPage(project);
            for (let stepNum = 1; stepNum <= numSteps; stepNum++) {
                addEditButtonListener(stepNum, projectId);
                addDeleteButtonListener(stepNum, projectId);
            };
        };
        generateAddStepButton();
    };
    //-------------------------------------------------------
    function generateIntroPage(project) {
        //add intro step - required
        const introDiv = document.createElement('div');
        introDiv.setAttribute('id', `step-0`);
        introDiv.setAttribute('class', 'edit-step');
        const introDivHtml = `
					<div class='edit-step__image-container'>
						<div class='edit-step__image'>
							<span class='edit-step__image-arrow'>&#129095;</span>
							<span class='edit-step__image-text'> Drag Images From Top Bar</span>
						</div>
					</div>
					<div class='edit-step__contents'>
						<div class='edit-step__text'>
							<div class='edit-step__heading' id='heading-0'>Intro and Supplies: ${project.name}</div>
							<div class='edit-step__description' id='text-0'>${project.intro}</div>
							<div class='edit-step__supplies' id='supplies-0' style='display:none'>${project.supplies}</div>
						</div>
						<div class='edit-step__options-container'>
							<div class='edit-step__reorder'>&#9776;</div>
							<div class='edit-step__edit' id='edit-0'>&#62;</div>
							<div class='edit-step__delete--intro' id='delete-0'></div>
						</div>
					</div>`;
        introDiv.innerHTML = introDivHtml;
        editMainContainer.appendChild(introDiv);
    };

    function generateStepsPage(project) {
        const destructionsHeadings = project.destructionsHeadings;
        const destructions = project.destructions;
        for (let i = 1; i <= destructions.length; i++) {
            const stepDiv = document.createElement('div');
            stepDiv.setAttribute('id', `step-${i}`);
            stepDiv.setAttribute('class', 'edit-step');
            const stepDivHtml = `
						<div class='edit-step__image-container'>
							<div class='edit-step__image'>
								<span class='edit-step__image-arrow'>&#129095;</span>
								<span class='edit-step__image-text'> Drag Images From Top Bar</span>
							</div>
						</div>
						<div class='edit-step__contents'>
							<div class='edit-step__text'>
								<div class='edit-step__heading' id='heading-${i}'>Step ${i}: ${destructionsHeadings[i-1]}</div>
								<div class='edit-step__description' id='text-${i}'>${destructions[i-1]}</div>
							</div>
							<div class='edit-step__options-container'>
								<div class='edit-step__reorder'>&#9776;</div>
								<div class='edit-step__edit' id='edit-${i}'>&#62;</div>
								<div class='edit-step__delete' id='delete-${i}'>&#215;</div>
							</div>
						</div>`;
            stepDiv.innerHTML = stepDivHtml;
            editMainContainer.appendChild(stepDiv);
        };
    };

    function generateAddStepButton() {
        const addStepFooter = document.createElement('div');
        addStepFooter.setAttribute('class', 'edit-main__add-step');
        const addStepFooterHtml = `<button class='edit-main__add-step-button btn' id='add-step-button' >Add Step</button>`;
        addStepFooter.innerHTML = addStepFooterHtml;
        editMainContainer.appendChild(addStepFooter);
        _addAddStepButtonListener(addStepFooter);
    };
    //-------------------------------------------


    function _addAddStepButtonListener(addStepFooter) {
        const addStepButton = document.querySelector('#add-step-button');
        addStepButton.addEventListener('click', async e => {
            const stepNum = document.querySelectorAll('.edit-step').length;
            const newStep = createStepDiv(stepNum);
            addStepFooter.insertAdjacentElement('beforebegin', newStep);
            //we do the edit and delete button event listeners here so we don't have to grab ALL the buttons again - minor improvement
            addEditButtonListener(stepNum, projectId);
            addDeleteButtonListener(stepNum, projectId);
            //add database stuff to new step function - should be just like the generate steps page but smaller. We could reload if we want to be really lazy. What I will do now is add an empty string to the database so the arrays for destructions and destructionsHeadings are equal length.
            const res = await fetch(`/api/projects/${projectId}/addStep/`);
            const data = await res.json();
            const { project } = data;
            //when we add a step we simply add an empty string to the database for destructions and destructionsHeading, so there's no need to pass project to the createStepDiv. The values will be updated on press of 'save' button.


        });
    };

    //----------------------------------------------
    //add edit button event listeners - input is an edit button node
    function addEditButtonListener(stepNum, projectId) {
        const editButton = document.querySelector(`#edit-${stepNum}`);
        editButton.addEventListener('click', (e) => {
            const stepId = e.target.id.slice(5);
            window.location.href = `/editDestructable/${projectId}/step/${stepId}`;
        });
    };

    //---------------------------------------------
    //delete step button
    //
    function addDeleteButtonListener(stepNum, projectId) {
        const deleteButton = document.querySelector(`#delete-${stepNum}`);
        deleteButton.addEventListener('click', async(e) => {
            const stepNum = e.target.id.slice(7);
            console.log('line 121 stepnum', stepNum);
            const res = await fetch(`/api/projects/${projectId}/delete/step/${stepNum}`, {
                method: 'delete'
            });
            const data = await res.json();
            const { project } = data;
            editMainContainer.innerHTML = '';
            renderEditPage(project);
        });
    };

    //-------------------------------------------
    //creates a blank step div - for add step button
    function createStepDiv(stepNumber) {
        const stepDiv = document.createElement('div');
        stepDiv.setAttribute('id', `step-${stepNumber}`);
        stepDiv.setAttribute('class', 'edit-step');
        const stepDivHtml = `
						<div class='edit-step__image-container'>
							<div class='edit-step__image'>
								<span class='edit-step__image-arrow'>&#129095;</span>
								<span class='edit-step__image-text'> Drag Images From Top Bar</span>
							</div>
						</div>
						<div class='edit-step__contents'>
							<div class='edit-step__text'>
								<div class='edit-step__heading' id='heading-${stepNumber}'>Step ${stepNumber}: (click to edit)</div>
								<div class='edit-step__description' id='text-${stepNumber}'></div>
							</div>
							<div class='edit-step__options-container'>
								<div class='edit-step__reorder'>&#9776;</div>
								<div class='edit-step__edit' id='edit-${stepNumber}'>&#62;</div>
								<div class='edit-step__delete' id='delete-${stepNumber}'>&#215;</div>
							</div>
						</div>`;
        stepDiv.innerHTML = stepDivHtml;
        return stepDiv;
    }

    //add project delete functionality
    const deleteButton = document.querySelector('#edit-nav__delete');
    deleteButton.addEventListener('click', async(e) => {
        window.location.href = '/projects';
        await fetch(`/api/projects/${projectId}/delete`, {
            method: 'delete'
        });
        console.log('here');
    });


    // add dropdown functionality
    function dropDownMaker(button) {
        button.addEventListener('mouseenter', (e) => {
            button.children[0].classList.toggle('show');
            button.children[0].classList.toggle('dropdown__content--opened');
            button.classList.toggle('btn-primary--selected');
            // setTimeout(() => {
            //     moreButton.children[0].classList.toggle('show');
            //     moreButton.classList.toggle('btn-primary--selected');
            // }, 500);
        })
        button.addEventListener('mouseleave', (e) => {
            setTimeout(() => {
                button.children[0].classList.toggle('show');
                button.children[0].classList.toggle('dropdown__content--opened');
                button.classList.toggle('btn-primary--selected');
            }, 100);
        });
    };
    const moreButton = document.querySelector('#edit-nav__more');
    dropDownMaker(moreButton);
    const addButton = document.querySelector('#edit-nav__add');
    dropDownMaker(addButton);



    //--------------------------------------------
    //--------------------------------------------
    //save this for later
    const saveButton = document.querySelector('#edit-nav__save');
    saveButton.addEventListener('click', async(e) => {
        const stepsHeadingsNodes = document.querySelectorAll('.edit-step__heading');
        let destructionsHeadings = [];
        stepsHeadingsNodes.forEach((stepHeadingNode, i) => {
            destructionsHeadings.push(stepHeadingNode.innerHTML);
        });
        const stepsDescriptionsNodes = document.querySelectorAll('.edit-step__description');
        let destructions = [];
        stepsDescriptionsNodes.forEach((stepDescriptionNode, i) => {
            destructions.push(stepDescriptionNode.innerHTML);
        })
        const name = destructionsHeadings.shift().slice(20);
        const intro = destructions.shift();
        const suppliesNode = document.querySelector('.edit-step__supplies');
        const supplies = suppliesNode.innerHTML;
        const body = { name, intro, supplies, destructions, destructionsHeadings };
        console.log('line189', body)
        const res = await fetch(`/api/projects/edit/${projectId}`, {
            method: 'put',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json();
        const { project } = data;
        console.log(project);
        editMainContainer.innerHTML = '';
        renderEditPage(project);
        //I may have to change the models so that destructables is a separate model, with a heading, descriptions, stepOrder, and projectId. I have having problems updating arrays in sequelize.
        // body = contentArray;
        // const res = await fetch(`/api/projects/edit/${projectId}`, {
        //     method: 'post',
        //     body: JSON.stringify(body),
        //     headers: { 'Content-Type': 'application/json' }
        // })
        // const data = await res.json();
        // project = data.project; //this should be our updated project
        // //I need to make a method here that dynamically updates the page.
    });


    //old code - might delete
    const form = document.querySelector('.edit-project-form');
    // form.addEventListener('submit', async(e) => {
    //     e.preventDefault();
    //     const formData = new FormData(form);

    //     //flesh this out based on form:
    //     //const input1 = formData.get('input1')
    //     //const input2 = formData.get('input2')
    //     // const body = { input1, input2 };


    //     const res2 = await fetch(`/api/projects/edit/${projectId}`, {
    //         method: 'post',
    //         body: JSON.stringify(body),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });
    //     const data = await res2.json();
    //     if (!res2.ok) { //add more here (like public/js/signup) for error handling
    //         const { message } = data;
    //         const errorsContainer = document.querySelector('#errors-container');
    //         errorsContainer.innerHTML = message;
    //         return;
    //     }
    //     // const { project } = data
    //     window.location.href = `/projects/${projectId}`
    // })
})