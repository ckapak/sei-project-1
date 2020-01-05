class Game {

  grid = []
  currentPlayer = ''
  gameBoardElement = null
  
  columnSelector = '.column'
  gameBoardSelector = '.game-board'
  circleSelector = '.circle'
  resetSelector = '.reset'

  constructor(config) {   
    console.log('game constructed')

    config = config || {}
    this.gameBoardSelector = config.gameBoard || this.gameBoardSelector
    this.columnSelector = config.column || this.columnSelector
    this.circleSelector = config.circle || this.circleSelector
    this.resetSelector = config.reset || this.resetSelector

    this.gameBoardElement = document.querySelector(this.gameBoardSelector)
    this.registerClickHandlers() 
    this.reset()
  }

  registerClickHandlers() {
    document.querySelectorAll(this.columnSelector).forEach((column, columnIndex) => {
      column.addEventListener('click', () => this.addCounter(column, columnIndex))
    })
    document.querySelector(this.resetSelector).addEventListener('click', () => this.reset())
  }

  addCounter(columnElement, columnIndex) {
    console.log('clicked: ' + columnIndex)

    if (!columnElement.classList.contains('playable')) {
      console.log(`column ${columnIndex} is not playable`)
      return
    } 

    this.addCounterElement(columnElement, columnIndex, this.currentPlayer)

    const column = this.grid[columnIndex]
    const nextPosition = column.filter(y => y).length
    this.grid[columnIndex][nextPosition] = this.currentPlayer

    const isColumnFull = nextPosition + 1 >= 6
    if (isColumnFull) {
      console.log(`column ${columnIndex} is full`)
      columnElement.classList.remove('playable')
    } 

    const isFinished = this.isGameFinished()
    if (isFinished) {
      console.log('Game is finished')
      document.querySelectorAll(this.columnSelector).forEach(x => x.classList.remove('playable'))
      return
    }
    
    this.swapCurrentPlayer()

    console.log('Next turn')
  }

  isGameFinished() {
    const winner = this.checkRow(this.grid) || this.checkColumn(this.grid) || this.checkBothDiagonal(this.grid)
    
    if (winner) {
      console.log(`Winner is: ${winner}`)
      return true
    } else if (this.checkForDraw(this.grid)) {
      console.log('It\'s a draw')
      return true
    }

    return false
  }

  addCounterElement(columnElement, columnIndex, color) {
    const div = document.createElement('div')
    div.classList.add('circle')
    div.classList.add(color)
    div.classList.add('hidden')
    columnElement.appendChild(div)
    setTimeout(() => div.classList.remove('hidden'), 0)
  }

  swapCurrentPlayer() {
    if (this.currentPlayer === 'blue') {
      this.currentPlayer = 'red'
    } else {
      this.currentPlayer = 'blue'
    }
  }

  checkForDraw(grid) {

    let total = 0
    let filledCount = 0

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        total++
        if (grid[y][x]) {
          filledCount++
        }
      }
    }

    return total > 0 && total === filledCount

  }

  reset() {

    this.currentPlayer = 'red'

    this.grid = []
    for (let column = 0; column < 7; column++) {
      this.grid[column] = []

      for (let row = 0; row < 6; row++) {
        this.grid[column][row] = ''
      }
    }

    document.querySelectorAll(this.columnSelector).forEach(n => n.classList.add('playable'))
    document.querySelectorAll(this.circleSelector).forEach(x => x.parentNode.removeChild(x))
    console.log('reset')
  }

  // diagonally transposing the array of arrays
  checkBothDiagonal(grid) {
    const result = this.checkDiagonal(grid)
    if (result) {
      return result
    }

    const reversedTable = grid.map((r) => Array.from(r).reverse())
    return this.checkDiagonal(reversedTable)
  }

  checkDiagonal(grid) {
    const height = grid.length
    const width = grid[0].length
    
    for (let k = 0 ; k <= width + height - 2; k++) {
      const data = []
    
      for (let j = 0 ; j <= k; j++) {
        const i = k - j
        if (i < height && j < width) {
          data.push(grid[i][j])
        }
      }
    
      if (data.length >= 4) {
        // console.log(data)
        const result = this.checkForWin(data)
        if (result) {
          return result
        }
      }
    }
  }

  checkColumn(grid) {
    for (let x = 0; x < grid[0].length; x++) {
      const data = []
    
      for (let y = 0; y < grid.length; y++) {
        data.push(grid[y][x])
      }
    
      // console.log(`x: ${x}, data: ${data}`)
      const result = this.checkForWin(data)
      if (result) {
        return result
      }
    }
  }

  checkRow(grid) {
    for (let y = 0; y < grid.length; y++) {
      const data = grid[y]
    
      //console.log(`y: ${y}, data: ${data}`)
      const result = this.checkForWin(data)
      if (result) {
        return result
      }
    }
  }

  checkForWin(data) {
    let lastColor

    let tally = 1

    for (let i = 0; i < data.length; i++) {
      const currentColor = data[i]
      if (currentColor && lastColor === currentColor) {
        tally++
      } else {
        tally = 1
      }
      // console.log(`i: ${i}, tally: ${tally}, currentColor: ${currentColor}, lastColor: ${lastColor}`)
      if (tally === 4) {
        console.log(`${currentColor} has won`)
        return currentColor
      }
      lastColor = currentColor
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {

  const game = new Game()

})

