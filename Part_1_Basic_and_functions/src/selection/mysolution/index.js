/**
 * @param {Array} collection
 * @params {Function[]} – Функции для запроса
 * @returns {Array}
 */
function query(collection) {
    var collectionCopy = JSON.parse(JSON.stringify(collection));
    var arrayFunctions = [].slice.call(arguments, 1);

    definePriority(arrayFunctions);

    arrayFunctions.sort(function (fuction1, function2) {
        return fuction1.priority - function2.priority;
    });

    return arrayFunctions.reduce(function (resultCollection, action) {
        // Запускаем следующую операцию с коллекцией, получившейся после предыдущей операции
        return action(resultCollection);
    }, collectionCopy);

}
function definePriority(operations) {
    //console.log(typeof operations + ' ' + operations.name);
    operations.forEach(function (element, index) {
        if(element.name === 'filter') {
            element.priority = 0;
        } else if(element.name === 'selectResult') {
            element.priority = 1;
        }
    });
}

/**
 * @params {String[]}
 */
function select() {
    var fields = [].slice.call(arguments);

    return function selectResult(resultCollection) {
        var resultObjects = [];
        for(var i = 0; i < resultCollection.length; i++) {
            var tmpObject = {};
            for(var j = 0; j < fields.length; j++) {
                if(fields[j] in resultCollection[i]) {
                    tmpObject[fields[j]] = resultCollection[i][fields[j]];
                }
            }
            resultObjects.push(tmpObject);
        }
        return resultObjects;
    }

}

/**
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Массив разрешённых значений
 */
function filterIn(property, values) {
    return function filter(collection) {
        var resultCollection = [];
        for(var i = 0; i < collection.length; i++) {
            for(var key in collection[i]) {
                if(key === property) {
                    for(var j = 0; j < values.length; j++) {
                        if(collection[i][key] === values[j]) { // you need to filter own properties with hasOwnProperties() method
                            resultCollection.push(collection[i]);
                        }
                    }
                }
            }
        }

        return resultCollection;
    }
}

module.exports = {
    query: query,
    select: select,
    filterIn: filterIn
};
