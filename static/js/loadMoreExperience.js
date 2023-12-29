window.onload = function() {
    let btn = document.querySelector('#add');
    btn.addEventListener('click', function(event) {
        const mainContent = document.getElementById('content');
        let count = document.querySelectorAll('form').length + 1;
        let workExperiance = document.createElement('div');
        workExperiance.classList.add('work-experiance');
        workExperiance.innerHTML = `
        <h2> Work Experience ${count} </h2>
        <form class="needs-validation" novalidate>
            <div class="form-row">
                <!-- date -->
                <div class="col-md-4 mb-3">
                    <label for="date${count}">Date</label>
                    <input type="text" class="form-control" id="date${count}" name="date${count}" >
                    <div class="valid-feedback">
                    Looks good!
                    </div>
                </div>
                <!-- compony -->
                <div class="col-md-8 mb-3">
                    <label for="compony${count}">Compony</label>
                    <input type="text" class="form-control" id="compony${count}" name="compony${count}" >
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                <!-- title -->
                <div class="col-md-12 mb-3">
                    <label for="title${count}">Title</label>
                    <input type="text" class="form-control" id="title${count}" name="title${count}" >
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                <!-- Description -->
                <div class="col-md-12 mb-3">
                    <label for="description${count}">Job Details</label>
                    <textarea class="form-control" id="description${count}" name="description${count}" rows="5"></textarea>
                    <div class="valid-feedback">
                    Looks good!
                    </div>
                </div>
            </div>
        </form>
        `
        mainContent.appendChild(workExperiance);
    });

    let save_btn = document.querySelector('#save');
    save_btn.addEventListener('click', function(event) {
        // to return count 
        let count = document.querySelectorAll('form').length;
        // console.log(count);
        let experiances = [];
        for(let i = 1; i <= count; i++) {
            let datei = `date${i}`; // let datei = 'date' + i
            let companyi = `compony${i}`;
            let titlei = `title${i}`
            let descriptioni = `description${i}`;
            
            /* Here I am getting elements by ID */
            let date = document.getElementById(datei);
            let company = document.getElementById(companyi);
            let title = document.getElementById(titlei);
            let description = document.getElementById(descriptioni);
            // console.log(date, company, title, description);
            experiances.push({date: date.value, company: company.value, title: title.value, description: description.value});
        }
        fetch('/experience', {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(experiances), // body data type must match "Content-Type" header
        });
    });
};