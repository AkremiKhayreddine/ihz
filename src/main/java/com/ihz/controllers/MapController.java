package com.ihz.controllers;

import com.ihz.models.Geoserver;
import com.ihz.models.Layer;
import com.ihz.repositories.GeoserverRepository;
import com.ihz.repositories.LayersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class MapController {

    @Autowired
    private LayersRepository layersRepository;

    @Autowired
    private GeoserverRepository geoserverRepository;

    @RequestMapping("/map")
    public String index() {
        return "map";
    }

    @RequestMapping("/getAllCouches")
    @ResponseBody
    public List<Layer> getAllLayers() {
        return layersRepository.findAll();
    }

    @RequestMapping("/admin/getConfig")
    @ResponseBody
    public Geoserver getConfig() {
        return geoserverRepository.findOne(1);
    }

}
