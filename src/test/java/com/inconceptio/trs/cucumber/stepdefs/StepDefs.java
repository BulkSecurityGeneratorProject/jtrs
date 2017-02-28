package com.inconceptio.trs.cucumber.stepdefs;

import com.inconceptio.trs.JtrsApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = JtrsApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
