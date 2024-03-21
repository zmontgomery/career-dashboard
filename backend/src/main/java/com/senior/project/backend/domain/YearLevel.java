package com.senior.project.backend.domain;

import lombok.Generated;

import java.util.ArrayList;
import java.util.List;

@Generated
public enum YearLevel {
    Freshman, Sophomore, Junior, Senior;

    /**
     * find current and previous years
     * @return list of years
     */
    public List<YearLevel> currentAndPreviousYears() {
        var yearList = previousYears();
        yearList.add(this);
        return yearList;
    }

    /**
     * find previous years
     * @return list of years
     */
    public List<YearLevel> previousYears() {
        List<YearLevel> yearList = new ArrayList<>();
        switch (this) {
            case Senior:
                yearList.add(YearLevel.Junior);
            case Junior:
                yearList.add(YearLevel.Sophomore);
            case Sophomore:
                yearList.add(YearLevel.Freshman);
            default:
                break;
        }
        return yearList;
    }

    /**
     * find current and upcoming years
     * @return list of years
     */
    public List<YearLevel> currentAndUpcomingYears() {
        var yearList = upcomingYears();
        yearList.add(this);
        return yearList;
    }

    /**
     * find upcoming years
     * @return list of years
     */
    public List<YearLevel> upcomingYears() {
        List<YearLevel> yearList = new ArrayList<>();
        switch (this) {
            case Freshman:
                yearList.add(YearLevel.Sophomore);
            case Sophomore:
                yearList.add(YearLevel.Junior);
            case Junior:
                yearList.add(YearLevel.Senior);
            default:
                break;
        }
        return yearList;
    }
}