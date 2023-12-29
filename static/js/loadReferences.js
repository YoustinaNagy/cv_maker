window.onload = function() {
    let btn = document.querySelector('#add');
    btn.addEventListener('click', function(event) {
        const mainContent = document.getElementById('content');
        let count = document.querySelectorAll('form').length + 1;
        let workExperiance = document.createElement('div');
        workExperiance.classList.add('work-experiance');
        workExperiance.innerHTML = `
        <form>
            <div class="form-row">
                <div class="col-md-12 mb-3">
                        <label for="name${count}">name</label>
                        <input type="text" class="form-control" id="name${count}" name="name${count}" >
                </div>
                <div class="col-md-12 mb-3">
                    <label for="quote${count}" class="form-label">quote</label>
                    <textarea class="form-control" id="quote${count}" name="quote${count}" rows="5"></textarea>
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
        let references = [];
        for(let i = 1; i <= count; i++) {
            let namei = `name${i}`; // let datei = 'date' + i
            let quotei = `quote${i}`;
            
            /* Here I am getting elements by ID */
            let name = document.getElementById(namei);
            let quote = document.getElementById(quotei);
            references.push({name: name.value, quote: quote.value});
        }
        fetch('/references', {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(references), // body data type must match "Content-Type" header
        });
    });
};