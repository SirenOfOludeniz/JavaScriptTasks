/**
 * @param {Array} collection
 * @params {Function[]} – Функции для запроса
 * @returns {Array}
 */
function query(collection) {
    var collectionCopy = JSON.parse(JSON.stringify(collection));
    var selectCollection = [];
    var filterCollection = [];
    var result;
    if(arguments.length === 1) {
        result = collectionCopy;
    }
    for (var i = 0; i < arguments.length; i++) {
        if(typeof arguments[i] === 'function') {
            if(arguments[i].name === 'filter') {
                filterCollection.push(arguments[i]);
            } else if(arguments[i].name === 'selectResult') {
                selectCollection.push(arguments[i]);
            }
        }
    }
    //блок по filterIn
    var tmpFilterCollection = [];
    var resultFilterCollection = [];

    var valueF = filterCollection[0];
    var someFilterCollection = valueF(collectionCopy);

    if(filterCollection.length === 1) {
        resultFilterCollection = someFilterCollection;
    } else if(filterCollection.length > 1) {
        for(var i = 0; i < filterCollection.length; i++) {
            if((i + 1) < filterCollection.length) {
                var previousFunctionF = filterCollection[i];
                tmpFilterCollection = previousFunctionF(someFilterCollection);//мы каждый раз запихиваем заново коллекцию friends. это косяк

                var currentFunctionF = filterCollection[i + 1];
                resultFilterCollection = currentFunctionF(tmpFilterCollection);
                someFilterCollection = resultFilterCollection;
            }
        }
    }

    //блок по select
    var tmpCollection = [];
    var resultCollection;
    var valuesS = selectCollection[0];
    var someSelectCollection = valuesS(resultFilterCollection); //сюда коллекцию из фильтров

    if(selectCollection.length === 1) {
        resultCollection = someSelectCollection;
    } else if(selectCollection.length > 1) {
        for(var i = 0; i < selectCollection.length; i++) {
            if((i + 1) < selectCollection.length) {
                var previousFunction = selectCollection[i];
                tmpCollection = previousFunction(someSelectCollection);

                var currentFunction = selectCollection[i + 1];
                resultCollection = currentFunction(tmpCollection);
                someSelectCollection = resultCollection;
            }

        }
    }

    result = resultCollection;
    return result;
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
