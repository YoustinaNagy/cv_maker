window.onload = function() {
    let btn = document.querySelector('#add');
    btn.addEventListener('click', function(event) {
        const mainContent = document.getElementById('content');
        let count = document.querySelectorAll('form').length + 1;
        let workExperiance = document.createElement('div');
        workExperiance.classList.add('work-experiance');
        workExperiance.innerHTML = `
        <h2> Certificate ${count} </h2>
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
            <!-- certificate -->
            <div class="col-md-8 mb-3">
                <label for="certificate${count}">Certificate</label>
                <input type="text" class="form-control" id="certificate_name${count}" name="certificate_name${count}" p\\d>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <!-- Description -->
            <div class="col-md-12 mb-3">
                <label for="description${count}">Description</label>
                <textarea class="form-control" id="description${count}" name="description${count}" rows="5"></textarea>
                <div class="valid-feedback">
                Looks good!
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
        let certificates = [];
        for(let i = 1; i <= count; i++) {
            let datei = `date${i}`; // let datei = 'date' + i
            let certificate_namei = `certificate_name${i}`;
            let descriptioni = `description${i}`;
            
            /* Here I am getting elements by ID */
            let date = document.getElementById(datei);
            let certificate_name = document.getElementById(certificate_namei);
            let description = document.getElementById(descriptioni);
            console.log(date, certificate_name, description);
            certificates.push({date: date.value, certificate_name: certificate_name.value, description: description.value});
        }
        fetch('/learning&certifications', {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(certificates), // body data type must match "Content-Type" header
        });
    });
};