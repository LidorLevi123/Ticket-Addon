'use strict'

const LABELS_KEY = 'labelDB'

var gLabels

_createLabels()

function getLabels() {
    return gLabels
}

function getLabelById(labelId) {
    return gLabels.find(label => label.id === labelId)
}

function _createLabels() {
    let labels = loadFromStorage(LABELS_KEY) || []
    if(labels && labels.length) gLabels = labels

    gLabels = [
        { id: 'l-101', color: '#8B0000', title: '' }, // dark red
        { id: 'l-102', color: '#FF0000', title: '' }, // red
        { id: 'l-103', color: '#FF8C00', title: '' }, // orange
        { id: 'l-104', color: '#FFFF00', title: '' }, // yellow
        { id: 'l-105', color: '#008000', title: '' }, // green
        { id: 'l-106', color: '#00CED1', title: '' }, // turquoise/cyan
        { id: 'l-107', color: '#0000CD', title: '' }, // blue
        { id: 'l-108', color: '#800080', title: '' }, // purple
        { id: 'l-110', color: '#A0522D', title: '' }, // brown
        { id: 'l-111', color: '#FFB6C1', title: '' }, // pink
        { id: 'l-112', color: '#FFE4B5', title: '' }, // peach/light orange
        { id: 'l-113', color: '#F5F5DC', title: '' }, // beige
        { id: 'l-114', color: '#ADFF2F', title: '' }, // light green
        { id: 'l-115', color: '#AFEEEE', title: '' }, // light blue
        { id: 'l-116', color: '#87CEFA', title: '' }, // soft blue
        { id: 'l-117', color: '#D8BFD8', title: '' }  // light purple
    ]
    _saveLabels()
}

function _saveLabels() {
    saveToStorage(LABELS_KEY, gLabels)
}