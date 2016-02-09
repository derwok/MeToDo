/**
 * Created by wok on 09.02.16.
 */

beforeEach(function () {
    jasmine.addMatchers({
        // check Dates to be inside tolerance of +/- 500 ms
        toBeCloseToDate: function () {
            return {
                compare: function (date1, date2) {
                    if ((date1 instanceof Date) && (date2 instanceof Date))
                    {
                        return {
                            pass: Math.abs(date1.getTime() - date2.getTime()) < 500
                        }
                    }
                    return {pass: false};
                }
            };
        }
    });
});