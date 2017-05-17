package com.ihz.controllers;

import com.ihz.models.Layer;
import com.ihz.repositories.LayersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/layers")
public class LayersController {


    @Autowired
    private LayersRepository layersRepository;


    @RequestMapping(value = "/{layer}", method = RequestMethod.PATCH)
    @ResponseBody
    public void update(@RequestBody Layer layer) {
        layersRepository.save(layer);
    }
}
