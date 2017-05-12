package com.ihz.controllers;

import com.ihz.models.Statistic;
import com.ihz.repositories.StatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsRepository statisticsRepository;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index() {
        return "statistics/index";
    }

    @RequestMapping(value = "/create", method = RequestMethod.GET)
    public String create() {
        return "statistics/create";
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    @ResponseBody
    public Statistic store(@RequestBody Statistic statistic) {
        return statisticsRepository.save(statistic);
    }
}
