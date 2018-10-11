class CalcController{

    constructor(){

        this._audio = new Audio('click.mp3');
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._locale = 'pt-BR';
        this._operation = [];
        this._lastOperator = '';
        this._lastNumber = '';
        this._audioOnOff  = false;
        this.$$ = document.querySelectorAll.bind(document);
        this.$ = document.querySelector.bind(document);

        this._currentDate;
        this.initialize();
        this.iniButtonEvents();
        this.initKeyboard();

    }

    initialize(){


        // executa um codigo em determinado x milissegundo
        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        },1000);

        this.setLasNumberToDisplay();
        this.pastFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });

        });



        // setTimeout(() => {
        //     clearInterval(interval);

        // },10000);


    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if (this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    copyToClipboard(){

        //cria um elemento
        let input = document.createElement('input');
        input.value = this.displayCalc;

        document.body.appendChild(input);


        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    pastFromClipboard(){
        document.addEventListener('paste', e =>{
            //copia a informação do clipboard
            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);
            //console.log(text);

        });

    }

    initKeyboard(){

        document.addEventListener('keyup', e => {
            this.playAudio();

            switch (e.key) {
                case 'c':
                    if (e.ctrlKey) {
                        this.copyToClipboard();
                    }
                    break;
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case ',':
                case '.':
                    this.addDot('.');
                    break;
                 case ',':
                    this.addDot('.');
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

            }
        });
    }

    addEventListenerAll(element, events, fn){
          events.split(" ").forEach( event => {
              element.addEventListener(event, fn, false);
          });

    }

    isNumber(value){
        return !isNaN(value);

    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLasNumberToDisplay();
    }

    clearEntry(){
        ///retira o ultimo elemento do array
        this._operation.pop();
        this.setLasNumberToDisplay();
    }

    getLastOperation(){
        return this._operation[this._operation.length -1];
    }

    isOperator(value){

        return (['+','-','*','%','/','='].indexOf(value) > -1);
    }

    setLastOperation(value){
        this._operation[this._operation.length -1] = value;
    }

    getResult(){
        try {
            return eval(this._operation.join(""));
        } catch (error) {
            setTimeout(() => {
                this.setError();
            }, 10);
            
        }
    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3)
        {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        } else if (this._operation.length > 3){

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3){

            this._lastNumber = this.getLastItem(false);
        }


        let result = this.getResult();

        if (last == "%")
        {
            result /= 100;
            this._operation = [result];

        } else{
          this._operation = [result];

          if (last){
            this._operation.push(last);

          }
        }

        this.setLasNumberToDisplay();
    }

    pushOperation(value){
        this._operation.push(value);

        if (this._operation.length > 3){


            this.calc();


        }

    }

    getLastItem(isOperator = true){

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {


                if (this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i];
                    break;
                }


        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLasNumberToDisplay(){
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value){

       // console.log('A', value, this._displayCalcEl.textContent.length);
        

      


        if (this.isNumber(this.getLastOperation())){

            if (this.isOperator(value)){
                this.pushOperation(value);

            } else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLasNumberToDisplay();
            }


        } else{

            if (this.isOperator(value)){
                this.setLastOperation(value);

            } else if (this.isNumber(value)){
                this.pushOperation(value);
                this.setLasNumberToDisplay();
            }

        }

      //  console.log(this._operation);

        //this._operation.push(value);
    }

    setError(){
        this.displayCalc = "Error";
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.toString().split('').some( () => "."))
        return;

        if (this.isOperator(lastOperation) || !lastOperation)
        {
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLasNumberToDisplay();

    }

    execBtn(value){
        this.playAudio();
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot('.');
                break;
             case ',':
                this.addDot('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    iniButtonEvents(){

        let buttons = this.$$("#buttons > g, #parts > g");

        buttons.forEach(element => {
             this.addEventListenerAll(element, 'click drag', e => {
                 let text = element.className.baseVal.replace("btn-","");

               //  console.log(text);
                 this.execBtn(text);
             });

             this.addEventListenerAll(element, 'mouseover mouseup mousedown', e => {
                element.style.cursor = "pointer";
             });
        });


    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            //day: '2-digit',
            //month: '2-digit',
            //year: 'numeric'
        });
        this.displayTime = new Date().toLocaleTimeString(this._locale);
    }



    get displayTime(){

        return this._timeEl.textContent;
    }

    set displayTime(value){
        this._timeEl.textContent = value;
    }


    get displayDate(){

        return this._dateEl.textContent;
    }

    set displayDate(value){

        this._dateEl.textContent = value;
    }


    get displayCalc(){

      
        return this._displayCalcEl.textContent;
    }

    set displayCalc(value){

        if (value.toString().length > 10)
        {
           this.setError();
            return;
        }
        this._displayCalcEl.textContent = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){

        this._currentDate = value;
    }


}