// const tetromino = require('./tetromino')

class Matrix{
    constructor (){
        this.score=0
        this.level=0
        this.isMoving=true
        this.matrix = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ]
        this.newLine=[0,0,0,0,0,0,0,0,0,0]   
        this.queue=[]
        this.linesErasedNumber=0
        this.timing=[600,500,450,400,350,300,270,230,200,170,150]
        this.levelsAndLines = [0,2,4,6,8,10,12,14,16,18,20]
    }
    get Matrix() {
        return this.matrix
    }
    set Matrix(matrixToSet){
        if(matrixToSet.length===20 && matrixToSet.every(line=>line.length===10) && matrixToSet.flat().every(unit=>typeof unit==='object')){
            this.matrix=matrixToSet
        }
    }
    increaseLevelIfPossible(){
        console.log('linesErased : ',this.linesErasedNumber)
        const correspondingLevel = this.levelsAndLines.findIndex(val=>this.linesErasedNumber < val)
        console.log('increaseIfPossible')
        console.log(this.levelsAndLines, this.linesErasedNumber)
        console.log("correspondingLevel",correspondingLevel)
        this.level = correspondingLevel==-1 ? 10 : correspondingLevel-1
    }
    getTimingRelatedToThisLevel(){
        console.log('-->',this.level)
        return this.timing[this.level]
    }
    addToTheQueue(){
        const elements = [new RectoL(), new VersoL(), new Square(), new Barre(), new SCurve(), new ZCurve(), new TBlock()]
        this.queue.push(elements
            .sort((a,b)=> 0.5 - Math.random())[0])
        
    }
    getPieceOfIndexNInQueue(index){
        return this.queue[index].positions[0]
    }
    removeFromQueue(){
        this.queue.shift()
    }
    tryToMoveLeft(){
        if(this.moving && this.queue[0].x>0){
            this.queue.x--
        }
    }
    goLeft(){
        //to the left border
        if( this.queue[0].x > -1 * this.queue[0].distanceToTheLeft() ){
            this.queue[0].x--
        }
    }
    goRight(){
        //to the right border
        //console.log('---->Distance to the right',this.queue[0].distanceToTheRight())
        if ( this.queue[0].x < 10 - ( this.queue[0].distanceToTheRight() +1 ) ){
            this.queue[0].x++
        }
    }
    rotate(){
        if(this.isRotationPossibleAgainstTheSideWalls()){
            this.queue[0].rotateTetromino()
        }
        //console.log('to the bottom',this.queue[0].distanceToTheBottom())
    }
    isRotationPossibleAgainstTheSideWalls(){
        //--------------------------------------------------------
        const nextPositionDistanceToTheLeft =  this.queue[0].distanceToTheLeft((this.queue[0].positionIndex+1)%4)
        const nextPositionDistanceToTheRight =  this.queue[0].distanceToTheRight((this.queue[0].positionIndex+1)%4)
        if( this.queue[0].x >= -1 * nextPositionDistanceToTheLeft && this.queue[0].x < 10 - ( nextPositionDistanceToTheRight ) && this.queue[0].y+this.queue[0].distanceToTheBottom() < 19){

            return true
        }else {
            return false
        }
    }
    canGoDown(){
        return this.queue[0].y+this.queue[0].distanceToTheBottom() < 19 ? true : false
    }
    goDown(){   
        if( this.queue[0].y+this.queue[0].distanceToTheBottom() < 19 ){
            //console.log('--->',this.queue[0].y+this.queue[0].distanceToTheBottom())
            this.queue[0].goDownTetromino()
        }
    }
    //use it for : 
    // normal
    // test if there is collision between tetromino and the base !
    getResult(copyTetro){
        //console.log('next tetro inside funtion : ',copyTetro)
        const tetro = copyTetro ? copyTetro : this.queue[0]
        //console.log(tetro.positionIndex,tetro.positions)
        let isProblem = false
        //console.log(tetro)
        const result = this.matrix.map( (line, y, arrayM)=> {
            return line.map( (unit, x, array)=>{
                if(x>=tetro.x && y>=tetro.y && x<tetro.x+tetro.totalWidth && y<tetro.y+tetro.totalWidth){
                    //console.log(y,x,'---',unit,'----',tetro.positions[tetro.positionIndex][y-tetro.y][x-tetro.x])
                    if(unit>0 && tetro.positions[tetro.positionIndex][y-tetro.y][x-tetro.x]==1){
                        console.log('--->collision')
                        isProblem=true
                    }
                    return tetro.positions[tetro.positionIndex][y-tetro.y][x-tetro.x]==1 ? tetro.color : unit
                }
                return unit
            })
        })
        return isProblem ? false : result
    }
    isNextMoveInContactWithBlocksOrBottom(direction){
        //1 : rotate  - 2 : right - 3 : down - 4 : left
        const copyTetro = new Tetromino()
        copyTetro.x=this.queue[0].x
        copyTetro.y=this.queue[0].y
        copyTetro.positionIndex=this.queue[0].positionIndex
        copyTetro.positions=this.queue[0].positions
        copyTetro.color=this.queue[0].color
        copyTetro.totalWidth=this.queue[0].totalWidth
        if(typeof direction !== 'number'){
            return null
        }
        if(direction==1){
            copyTetro.rotateTetromino()
        }else if(direction==2){
            copyTetro.x++
        }else if(direction==3){
            copyTetro.y++
        }else if(direction==4){
            copyTetro.x--
        }
        if(this.getResult(copyTetro)!==false && this.canGoDown()){
            return false
        }
        return true
    }
    getDistanceToTheRightOfTheFirstTetromino(){
        return this.queue[0].distanceToTheRight()
    }
    getDistanceToTheLeftOfTheFirstTetromino(){
        return this.queue[0].distanceToTheLeft()
    }
    makeFullLinesColored(){
        let madeFullLinesColored = false
        this.matrix = this.matrix.map(line=>{
            if(line.every(unit=>unit>0)){
                madeFullLinesColored = true
                return [8,8,8,8,8,8,8,8,8,8]
            }else{
                return line
            }
        })
        return madeFullLinesColored
    }
    eraseFullLines(){
        const filtered = this.matrix.filter(line=>!line.every(unit=>unit>0))
        //console.log('(inside eraseFullLines)lines to erase : ', 20-filtered.length)
        const filteredLineNumber = 20-filtered.length
        this.increasePoints(filteredLineNumber)
        this.linesErasedNumber+=filteredLineNumber
        console.log('total erased lines : ', this.linesErasedNumber)
        console.log('filtered : ',filtered)
        console.log('filteredLineNumber:',filteredLineNumber)
        for(let i=0 ; i<filteredLineNumber ; i++){
            console.log('i : ',i)
            filtered.unshift(this.newLine)
        }
        // console.log('after adding new empty lines : ', filtered)
        this.matrix=filtered
        //console.log('new matrix with new lines : ', this.matrix)
        return filteredLineNumber
    }
    increasePoints(lineNumber){
        const multiplicator = this.level == 0 ? 1 : this.level
        if(lineNumber===1){
            this.score+=100*multiplicator
        }else if(lineNumber===2){
            this.score+=300*multiplicator
        }else if(lineNumber===3){
            this.score+=500*multiplicator
        }else if(lineNumber===4){
            this.score+=800*multiplicator
        }
    }
}

// module.exports={Matrix}
