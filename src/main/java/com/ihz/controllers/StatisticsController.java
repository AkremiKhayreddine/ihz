package com.ihz.controllers;

import com.ihz.models.Statistic;
import com.ihz.repositories.StatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.xml.transform.Result;
import java.util.stream.Collectors;


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
    public ResponseEntity<?> store(@Valid @RequestBody Statistic statistic, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            System.out.println(bindingResult.toString());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        } else {
            Statistic s = statisticsRepository.save(statistic);
            return ResponseEntity.ok(s);
        }

    }

    @RequestMapping(value = "/{statistic}", method = RequestMethod.DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer statistic) {
        statisticsRepository.delete(statistic);
    }
}
