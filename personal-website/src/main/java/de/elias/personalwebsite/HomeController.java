package de.elias.personalwebsite;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private static final String TITLE = "Meine persönliche Website";

    private static final List<String> SECTIONS = List.of(
            "Über mich",
            "Projekte",
            "Kontakt"
    );

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", TITLE);
        model.addAttribute("sections", SECTIONS);
        return "home";
    }
}
