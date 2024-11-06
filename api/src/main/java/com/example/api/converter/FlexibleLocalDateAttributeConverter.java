package com.example.api.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Converter(autoApply = true)
public class FlexibleLocalDateAttributeConverter implements AttributeConverter<LocalDate, String> {

    private static final DateTimeFormatter[] FORMATTERS = {
        DateTimeFormatter.ofPattern("yyyy-MM-dd"),
        DateTimeFormatter.ofPattern("dd-MM-yyyy"),
        DateTimeFormatter.ofPattern("MM/dd/yyyy"),
        DateTimeFormatter.ofPattern("yyyy/MM/dd")
    };

    @Override
    public String convertToDatabaseColumn(LocalDate localDate) {
        return Optional.ofNullable(localDate)
                .map(date -> date.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .orElse(null);
    }

    @Override
    public LocalDate convertToEntityAttribute(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) {
            return null;
        }

        for (DateTimeFormatter formatter : FORMATTERS) {
            try {
                return LocalDate.parse(dateString, formatter);
            } catch (Exception e) {
                // Try next formatter
            }
        }

        throw new IllegalArgumentException("Unable to parse date: " + dateString);
    }
}
