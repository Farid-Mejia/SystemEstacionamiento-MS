package com.cibertec.application.service;

import com.cibertec.web.dto.VisitorAPIResponse;
import com.cibertec.web.dto.VisitorRequestDto;

import java.util.List;

public interface VisitorService {

  VisitorAPIResponse getVisitorByDni(String dni);

  VisitorAPIResponse createVisitor(VisitorRequestDto requestDto);

  List<VisitorAPIResponse> getAllVisitors();

  VisitorAPIResponse updateVisitor(Integer id, VisitorRequestDto requestDto);

  VisitorAPIResponse deleteVisitor(Integer id);
}
