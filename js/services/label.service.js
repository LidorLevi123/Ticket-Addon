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
        { id: 'l-101', color: '#8B0000', title: 'Dark red' },
        { id: 'l-102', color: '#FF0000', title: 'Red' }, 
        { id: 'l-103', color: '#FF8C00', title: 'Orange' }, 
        { id: 'l-104', color: '#FFFF00', title: 'Yellow' }, 
        { id: 'l-105', color: '#008000', title: 'Green' }, 
        { id: 'l-106', color: '#00CED1', title: 'Turquoise/cyan' }, 
        { id: 'l-107', color: '#0000CD', title: 'Blue' }, 
        { id: 'l-108', color: '#800080', title: 'Purple' }, 
        { id: 'l-110', color: '#A0522D', title: 'Brown' }, 
        { id: 'l-111', color: '#FFB6C1', title: 'Pink' }, 
        { id: 'l-112', color: '#FFE4B5', title: 'Peach/light orange' }, 
        { id: 'l-113', color: '#F5F5DC', title: 'Beige' }, 
        { id: 'l-114', color: '#ADFF2F', title: 'Light green' }, 
        { id: 'l-115', color: '#AFEEEE', title: 'Light blue' }, 
        { id: 'l-116', color: '#87CEFA', title: 'Soft blue' }, 
        { id: 'l-117', color: '#D8BFD8', title: 'Light purple' }  
    ]
    _saveLabels()
}

function _saveLabels() {
    saveToStorage(LABELS_KEY, gLabels)
}