// Copyright 2019 Atul R. All rights reserved.
#pragma once

#include <memory>
#include <QApplication>

namespace qode {
    static QApplication* qtAppInstance;
    int Start(int argc, char* argv[]);
}  // namespace qode
