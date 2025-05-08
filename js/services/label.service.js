'use strict'

const LABELS_KEY = 'labelDB'

var gLabels

_createLabels()

console.log(gLabels)

function getLabels() {
    return gLabels
}

function _createLabels() {
    let labels = loadFromStorage(LABELS_KEY) || []
    if(labels && labels.length) gLabels = labels

    gLabels = [
        { color: '#808080', title: '' }, // gray
        { color: '#8B0000', title: '' }, // dark red
        { color: '#FF0000', title: '' }, // red
        { color: '#FF8C00', title: '' }, // orange
        { color: '#FFFF00', title: '' }, // yellow
        { color: '#008000', title: '' }, // green
        { color: '#00CED1', title: '' }, // turquoise/cyan
        { color: '#0000CD', title: '' }, // blue
        { color: '#800080', title: '' }, // purple
      
        { color: '#D3D3D3', title: '' }, // light gray
        { color: '#A0522D', title: '' }, // brown
        { color: '#FFB6C1', title: '' }, // pink
        { color: '#FFE4B5', title: '' }, // peach/light orange
        { color: '#F5F5DC', title: '' }, // beige
        { color: '#ADFF2F', title: '' }, // light green
        { color: '#AFEEEE', title: '' }, // light blue
        { color: '#87CEFA', title: '' }, // soft blue
        { color: '#D8BFD8', title: '' }  // light purple
    ]
    _saveLabels()
}

function _saveLabels() {
    saveToStorage(LABELS_KEY, gLabels)
}