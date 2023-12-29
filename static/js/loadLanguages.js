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
                        <label for="language${count}">language</label>
                        <input type="text" class="form-control" id="language${count}" name="language${count}" >
                </div>
                <div class="col-md-6 mb-3">
                    <label for="fluency${count}" class="form-label">fluency</label>
                    <input type="range" class="form-range" id="fluency${count}" min="1" max="5" step="1">
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
        let langauges = [];
        for(let i = 1; i <= count; i++) {
            let langaugei = `language${i}`; // let datei = 'date' + i
            let fluencyi = `fluency${i}`;
            
            /* Here I am getting elements by ID */
            let langauge = document.getElementById(langaugei);
            let fluency = document.getElementById(fluencyi);
            console.log(langauge, fluency);
            langauges.push({name: langauge.value, fluency: fluency.value});
        }
        fetch('/languages', {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(langauges), // body data type must match "Content-Type" header
        });
    });
};