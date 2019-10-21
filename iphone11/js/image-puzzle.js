var timerFunction;

var imagePuzzle = {
    stepCount: 0,
    startTime: new Date().getTime(),
    startGame: function (images, gridSize) {
        this.setImage(images, gridSize = 3);
        helper.doc('playPanel').style.display = 'block';
        helper.shuffle('sortable');
        this.stepCount = 0;
        this.startTime = new Date().getTime();
        this.tick();
    },
    tick: function () {
        var now = new Date().getTime();
        elapsedTime = parseInt((now - imagePuzzle.startTime) / 1000, 10);
        // console.log(elapsedTime);
        if (elapsedTime === 60) {
            // Limit playing time   

            document.getElementById("myDialog1").showModal();

            document.getElementById("textresult1").innerHTML =
                "<img src=\"https://img.alicdn.com/tfs/TB1am6eiEH1gK0jSZSyXXXtlpXa-320-320.png\" >";
            document.getElementById("pop-button1").innerHTML =
                "<a class='button' onclick='clicked1()'><img src= \"https://laz-img-cdn.alicdn.com/images/ims-web/TB1kP6_hlr0gK0jSZFnXXbRRXXa.png\"></a>";

            console.log(elapsedTime);
            elapsedTime =
                helper.doc('timerPanel').textContent = elapsedTime;
            return;
        }
        helper.doc('timerPanel').textContent = elapsedTime;
        timerFunction = setTimeout(imagePuzzle.tick, 1000);
    },
    setImage: function (images, gridSize) {
        var percentage = 100 / (gridSize - 1);
        var image = images[Math.floor(Math.random() * images.length)];
        helper.doc('imgTitle').innerHTML = image.title;
        helper.doc('actualImage').setAttribute('src', image.src);
        helper.doc('sortable').innerHTML = '';
        for (var i = 0; i < gridSize * gridSize; i++) {
            var xpos = (percentage * (i % gridSize)) + '%';
            var ypos = (percentage * Math.floor(i / gridSize)) + '%';

            let li = document.createElement('li');
            li.id = i;
            li.setAttribute('data-value', i);
            li.style.backgroundImage = 'url(' + image.src + ')';
            li.style.backgroundSize = (gridSize * 100) + '%';
            li.style.backgroundPosition = xpos + ' ' + ypos;
            li.style.width = 400 / gridSize + 'px';
            li.style.height = 400 / gridSize + 'px';

            li.setAttribute('draggable', 'true');
            li.ondragstart = (event) => event.dataTransfer.setData('data', event.target.id);
            li.ondragover = (event) => event.preventDefault();
            li.ondrop = (event) => {
                let origin = helper.doc(event.dataTransfer.getData('data'));
                let dest = helper.doc(event.target.id);
                let p = dest.parentNode;

                if (origin && dest && p) {
                    let temp = dest.nextSibling;
                    p.insertBefore(dest, origin);
                    p.insertBefore(origin, temp);

                    let vals = Array.from(helper.doc('sortable').children).map(x => x.id);
                    var now = new Date().getTime();
                    helper.doc('stepCount').textContent = ++imagePuzzle.stepCount;
                    // document.querySelector('.timeCount').textContent = (parseInt((now - imagePuzzle.startTime) / 1000, 10));
                    console.log(imagePuzzle.stepCount);
                    if (imagePuzzle.stepCount === 10) {
                        document.getElementById("myDialog2").showModal();

                        document.getElementById("textresult2").innerHTML =
                            "<img src=\"https://img.alicdn.com/tfs/TB1am6eiEH1gK0jSZSyXXXtlpXa-320-320.png\" >";
                        document.getElementById("pop-button2").innerHTML =
                            "<a class='button' onclick='clicked2()'><img src= \"https://laz-img-cdn.alicdn.com/images/ims-web/TB1kP6_hlr0gK0jSZFnXXbRRXXa.png\"></a>";

                        console.log(imagePuzzle.stepCount);
                        elapsedTime =
                        helper.doc('stepCount').textContent = imagePuzzle.stepCount;
                        return;
                    }
                    if (isSorted(vals)) {
                        // helper.doc('actualImageBox').style.display = 'none';
                        // helper.doc('gameOver').style.display = 'block';
                        document.getElementById("myDialog4").showModal();
                        document.getElementById("pop-button2").innerHTML =
                            "<h2>Game Over</h2><br><p>Total Step taken :" + imagePuzzle.stepCount + "</p><br><p>Total time taken:" + elapsedTime + "</p>";

                        // helper.doc('actualImageBox').innerHTML = helper.doc('gameOver').innerHTML;
                        // helper.doc('stepCount').textContent = imagePuzzle.stepCount;

                    }
                }
            };
            li.setAttribute('dragstart', 'true');
            helper.doc('sortable').appendChild(li);
        }
        helper.shuffle('sortable');
    }
};

isSorted = (arr) => arr.every((elem, index) => {
    return elem == index;
});

var helper = {
    doc: (id) => document.getElementById(id) || document.createElement("div"),

    shuffle: (id) => {
        var ul = document.getElementById(id);
        for (var i = ul.children.length; i >= 0; i--) {
            ul.appendChild(ul.children[Math.random() * i | 0]);
        }
    }
}