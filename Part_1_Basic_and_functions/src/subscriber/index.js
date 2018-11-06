module.exports = {

    objectList: [],

    /**
     *
     * @param {String} event
     * этот метод проверяет, есть ли хоть одно событие или нет
     */
    isexist: function (event) {
        var result = false;
        this.objectList.forEach(function (value) {
            if (value.eventName === event) {
                result = true;
            }
        });
        return result;
    },
    /**
     * @param {String} event
     * @param {Object} subscriber
     * @param {Function} handler
     */
    on: function (event, subscriber, handler) {
       this.objectList.push({
           eventName: event,
           subscribeObject: subscriber,
           handlerFunction: handler
       });
        return this;
    },

    /**
     * @param {String} event
     * @param {Object} subscriber
     */
    off: function (event, subscriber) {
        if(this.isexist(event)) {
            var newObjectList = this.objectList.filter(function (value) {
                if(value.eventName === event && value.subscribeObject === subscriber) {
                    return false;
                } else {
                    return true;
                }

               // return value.eventName !== event || value.subscribeObject !== subscriber;
            });
            this.objectList = newObjectList;
        }

        return this;
    },

    /**
     * @param {String} event
     */
    emit: function (event) {
        if(this.isexist(event)) {
            this.objectList.forEach(function (value) {
                if(value.eventName === event) {
                    value.handlerFunction.call(value.subscribeObject);
                }
            });
        }

        return this;
    }
};
