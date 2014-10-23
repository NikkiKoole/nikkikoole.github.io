stage = null
renderer = null

makeExperiment = ->
    graphics = new PIXI.Graphics()
    graphics.lineStyle(10,0xff00ff)
    graphics.moveTo(200,200)
    graphics.lineTo(400,400)
    graphics.lineStyle(10,0xff0000)
    graphics.moveTo(0,0)
    graphics.arcTo(200,200,400,400, 200)
    stage.addChild graphics

window.onload = ->
    renderOptions =
        antialiasing:true
        transparent:false
        resolution:1
    renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, renderOptions)
    document.body.appendChild renderer.view
    stage = new PIXI.Stage 0xe7e7e7
    makeExperiment()
    renderer.render(stage)
